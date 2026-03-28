package com.example.demo.service;

import com.example.demo.entity.Transaction;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

@Service
public class TransactionExtractionService {

    public List<Transaction> extract(String userId, String receiptId, String fileName, Path filePath) throws IOException {
        String lowerName = fileName == null ? "" : fileName.toLowerCase(Locale.ROOT);
        if (!lowerName.endsWith(".csv")) {
            throw new IllegalArgumentException("Only CSV extraction is enabled right now for automatic processing.");
        }

        List<String> lines = Files.readAllLines(filePath);
        if (lines.isEmpty()) {
            return List.of();
        }

        CsvHeader header = CsvHeader.from(parseCsvLine(lines.get(0)));
        List<Transaction> transactions = new ArrayList<>();

        for (int index = 1; index < lines.size(); index++) {
            String line = lines.get(index).trim();
            if (line.isEmpty()) {
                continue;
            }

            List<String> values = parseCsvLine(line);
            Transaction transaction = buildTransaction(userId, receiptId, fileName, header, values);
            if (transaction != null) {
                transactions.add(transaction);
            }
        }

        return transactions;
    }

    private Transaction buildTransaction(String userId, String receiptId, String fileName, CsvHeader header, List<String> values) {
        BigDecimal amount = extractAmount(header, values);
        if (amount == null || amount.compareTo(BigDecimal.ZERO) == 0) {
            return null;
        }

        Transaction transaction = new Transaction();
        transaction.setUser_id(userId);
        transaction.setReceipt_id(receiptId);
        transaction.setAmount(amount.abs());
        transaction.setCurrency("NGN");
        transaction.setDirection(inferDirection(header, values, amount));
        transaction.setCategory(extractCategory(header, values));
        transaction.setMerchant_name(extractDescription(header, values));
        transaction.setDescription(extractDescription(header, values));
        transaction.setTransaction_date(extractDate(header, values));
        transaction.setSource_type(inferSourceType(fileName));
        transaction.setCreated_at(LocalDateTime.now());
        return transaction;
    }

    private String inferSourceType(String fileName) {
        String name = fileName == null ? "" : fileName.toLowerCase(Locale.ROOT);
        if (name.contains("moniepoint")) return "moniepoint";
        if (name.contains("opay")) return "opay";
        if (name.contains("paystack")) return "paystack";
        if (name.contains("bank")) return "bank_statement";
        return "upload";
    }

    private String inferDirection(CsvHeader header, List<String> values, BigDecimal amount) {
        if (header.typeIndex >= 0) {
            String type = valueAt(values, header.typeIndex).toLowerCase(Locale.ROOT);
            if (type.contains("credit") || type.contains("deposit") || type.contains("money in")) {
                return "in";
            }
            if (type.contains("debit") || type.contains("withdraw") || type.contains("money out")) {
                return "out";
            }
        }

        if (header.creditIndex >= 0) {
            String value = valueAt(values, header.creditIndex);
            if (!value.isBlank() && parseMoney(value) != null) {
                return "in";
            }
        }

        if (header.debitIndex >= 0) {
            String value = valueAt(values, header.debitIndex);
            if (!value.isBlank() && parseMoney(value) != null) {
                return "out";
            }
        }

        return amount.signum() < 0 ? "out" : "in";
    }

    private BigDecimal extractAmount(CsvHeader header, List<String> values) {
        if (header.debitIndex >= 0) {
            BigDecimal debit = parseMoney(valueAt(values, header.debitIndex));
            if (debit != null && debit.compareTo(BigDecimal.ZERO) > 0) {
                return debit.negate();
            }
        }

        if (header.creditIndex >= 0) {
            BigDecimal credit = parseMoney(valueAt(values, header.creditIndex));
            if (credit != null && credit.compareTo(BigDecimal.ZERO) > 0) {
                return credit;
            }
        }

        if (header.amountIndex >= 0) {
            return parseMoney(valueAt(values, header.amountIndex));
        }

        return null;
    }

    private String extractCategory(CsvHeader header, List<String> values) {
        if (header.categoryIndex >= 0) {
            String category = valueAt(values, header.categoryIndex).trim();
            if (!category.isBlank()) {
                return category;
            }
        }

        String description = extractDescription(header, values).toLowerCase(Locale.ROOT);
        if (description.contains("transport") || description.contains("uber") || description.contains("bolt")) return "Transport";
        if (description.contains("stock") || description.contains("inventory")) return "Stock";
        if (description.contains("rent")) return "Rent";
        if (description.contains("fuel") || description.contains("power") || description.contains("utility")) return "Utilities";
        return "Other";
    }

    private String extractDescription(CsvHeader header, List<String> values) {
        if (header.descriptionIndex >= 0) {
            String description = valueAt(values, header.descriptionIndex).trim();
            if (!description.isBlank()) {
                return description;
            }
        }

        if (header.merchantIndex >= 0) {
            String merchant = valueAt(values, header.merchantIndex).trim();
            if (!merchant.isBlank()) {
                return merchant;
            }
        }

        return "Uploaded transaction";
    }

    private LocalDate extractDate(CsvHeader header, List<String> values) {
        if (header.dateIndex >= 0) {
            String raw = valueAt(values, header.dateIndex).trim();
            LocalDate parsed = parseDate(raw);
            if (parsed != null) {
                return parsed;
            }
        }

        return LocalDate.now();
    }

    private LocalDate parseDate(String raw) {
        if (raw == null || raw.isBlank()) {
            return null;
        }

        List<DateTimeFormatter> formatters = List.of(
            DateTimeFormatter.ISO_LOCAL_DATE,
            DateTimeFormatter.ofPattern("d/M/uuuu"),
            DateTimeFormatter.ofPattern("dd/MM/uuuu"),
            DateTimeFormatter.ofPattern("d-M-uuuu"),
            DateTimeFormatter.ofPattern("dd-MM-uuuu")
        );

        for (DateTimeFormatter formatter : formatters) {
            try {
                return LocalDate.parse(raw, formatter);
            } catch (DateTimeParseException ignored) {
            }
        }

        return null;
    }

    private BigDecimal parseMoney(String raw) {
        if (raw == null) {
            return null;
        }

        String normalized = raw.replaceAll("[^0-9,.-]", "").trim();
        if (normalized.isBlank()) {
            return null;
        }

        if (normalized.indexOf(',') >= 0 && normalized.indexOf('.') < 0) {
            normalized = normalized.replace(",", "");
        } else {
            normalized = normalized.replace(",", "");
        }

        try {
            return new BigDecimal(normalized);
        } catch (NumberFormatException ignored) {
            return null;
        }
    }

    private String valueAt(List<String> values, int index) {
        if (index < 0 || index >= values.size()) {
            return "";
        }
        return values.get(index);
    }

    private List<String> parseCsvLine(String line) {
        List<String> values = new ArrayList<>();
        StringBuilder current = new StringBuilder();
        boolean inQuotes = false;

        for (int index = 0; index < line.length(); index++) {
            char currentChar = line.charAt(index);
            if (currentChar == '"') {
                inQuotes = !inQuotes;
                continue;
            }
            if (currentChar == ',' && !inQuotes) {
                values.add(current.toString().trim());
                current.setLength(0);
                continue;
            }
            current.append(currentChar);
        }

        values.add(current.toString().trim());
        return values;
    }

    private static class CsvHeader {
        private final int dateIndex;
        private final int descriptionIndex;
        private final int merchantIndex;
        private final int categoryIndex;
        private final int amountIndex;
        private final int debitIndex;
        private final int creditIndex;
        private final int typeIndex;

        private CsvHeader(int dateIndex, int descriptionIndex, int merchantIndex, int categoryIndex, int amountIndex, int debitIndex, int creditIndex, int typeIndex) {
            this.dateIndex = dateIndex;
            this.descriptionIndex = descriptionIndex;
            this.merchantIndex = merchantIndex;
            this.categoryIndex = categoryIndex;
            this.amountIndex = amountIndex;
            this.debitIndex = debitIndex;
            this.creditIndex = creditIndex;
            this.typeIndex = typeIndex;
        }

        private static CsvHeader from(List<String> headerValues) {
            int dateIndex = -1;
            int descriptionIndex = -1;
            int merchantIndex = -1;
            int categoryIndex = -1;
            int amountIndex = -1;
            int debitIndex = -1;
            int creditIndex = -1;
            int typeIndex = -1;

            for (int index = 0; index < headerValues.size(); index++) {
                String value = headerValues.get(index).toLowerCase(Locale.ROOT);
                if (dateIndex < 0 && (value.contains("date") || value.contains("time"))) dateIndex = index;
                if (descriptionIndex < 0 && (value.contains("description") || value.contains("narration") || value.contains("details") || value.contains("reference"))) descriptionIndex = index;
                if (merchantIndex < 0 && (value.contains("merchant") || value.contains("vendor") || value.contains("beneficiary"))) merchantIndex = index;
                if (categoryIndex < 0 && value.contains("category")) categoryIndex = index;
                if (amountIndex < 0 && value.equals("amount")) amountIndex = index;
                if (debitIndex < 0 && (value.contains("debit") || value.contains("withdraw"))) debitIndex = index;
                if (creditIndex < 0 && (value.contains("credit") || value.contains("deposit"))) creditIndex = index;
                if (typeIndex < 0 && (value.contains("type") || value.contains("direction"))) typeIndex = index;
            }

            return new CsvHeader(dateIndex, descriptionIndex, merchantIndex, categoryIndex, amountIndex, debitIndex, creditIndex, typeIndex);
        }
    }
}
