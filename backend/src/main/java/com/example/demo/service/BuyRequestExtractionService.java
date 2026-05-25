package com.example.demo.service;

import com.example.demo.dto.BuyRequestIntentResponse;
import org.springframework.stereotype.Service;

import java.text.DecimalFormat;
import java.text.DecimalFormatSymbols;
import java.text.ParseException;
import java.util.List;
import java.util.Locale;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class BuyRequestExtractionService {

    private static final Pattern K_BUDGET_PATTERN = Pattern.compile("(?i)(?:naira|ngn|n)?\\s*(\\d+(?:[.,]\\d+)?)\\s*k\\b");
    private static final Pattern RAW_BUDGET_PATTERN = Pattern.compile("(?i)(?:₦|naira|ngn|n)?\\s*(\\d[\\d,]{3,}(?:\\.\\d+)?)\\b");
    private static final Pattern LOCATION_WITH_PREPOSITION = Pattern.compile("(?i)\\b(?:in|at|around|near|for delivery to|delivery to|to)\\s+([a-z][a-z\\s-]{1,40})");
    private static final List<Pattern> BUY_PATTERNS = List.of(
        Pattern.compile("(?i)\\bwan buy\\b"),
        Pattern.compile("(?i)\\bwanna buy\\b"),
        Pattern.compile("(?i)\\bwant to buy\\b"),
        Pattern.compile("(?i)\\bwant buy\\b"),
        Pattern.compile("(?i)\\bneed to buy\\b"),
        Pattern.compile("(?i)\\bneed\\b"),
        Pattern.compile("(?i)\\blooking for\\b"),
        Pattern.compile("(?i)\\bfind me\\b"),
        Pattern.compile("(?i)\\bget me\\b"),
        Pattern.compile("(?i)\\border\\b"),
        Pattern.compile("(?i)\\bpurchase\\b"),
        Pattern.compile("(?i)\\bbuy\\b")
    );
    private static final Pattern LEADING_FILLER = Pattern.compile("(?i)^(?:abeg|please|pls|i|i\\s+dey|i\\s+wan|i\\s+want|i\\s+need|make\\s+i|help\\s+me)\\b[\\s,:-]*");
    private static final Pattern SPACE_PATTERN = Pattern.compile("\\s+");
    private static final Pattern TRAILING_PUNCTUATION = Pattern.compile("^[\\p{Punct}\\s]+|[\\p{Punct}\\s]+$");

    public BuyRequestIntentResponse extract(String message) {
        if (message == null || message.isBlank()) {
            return new BuyRequestIntentResponse("UNKNOWN", "", 0, "");
        }

        String normalized = normalizeWhitespace(message);
        String lower = normalized.toLowerCase(Locale.ROOT);

        Integer budget = extractBudget(normalized);
        String location = extractLocation(normalized, budget);
        String product = extractProduct(normalized, lower, location, budget);
        boolean buyRequest = isBuyRequest(lower, budget, product);
        if (!buyRequest) {
            return new BuyRequestIntentResponse("UNKNOWN", "", 0, "");
        }

        return new BuyRequestIntentResponse("BUY_REQUEST", product, budget == null ? 0 : budget, location);
    }

    private boolean isBuyRequest(String lower, Integer budget, String product) {
        for (Pattern pattern : BUY_PATTERNS) {
            if (pattern.matcher(lower).find()) {
                return true;
            }
        }

        return budget != null && !product.isBlank();
    }

    private Integer extractBudget(String message) {
        Matcher kMatcher = K_BUDGET_PATTERN.matcher(message);
        if (kMatcher.find()) {
            double value = parseNumber(kMatcher.group(1));
            return (int) Math.round(value * 1000);
        }

        Matcher rawMatcher = RAW_BUDGET_PATTERN.matcher(message);
        if (rawMatcher.find()) {
            return (int) Math.round(parseNumber(rawMatcher.group(1)));
        }

        return null;
    }

    private String extractLocation(String message, Integer budget) {
        Matcher prepositionMatcher = LOCATION_WITH_PREPOSITION.matcher(message);
        if (prepositionMatcher.find()) {
            String candidate = trimTrailingBudget(prepositionMatcher.group(1));
            return cleanField(candidate);
        }

        if (budget == null) {
            return "";
        }

        Matcher kMatcher = K_BUDGET_PATTERN.matcher(message);
        if (kMatcher.find()) {
            String trailing = cleanField(message.substring(kMatcher.end()));
            if (!trailing.isBlank() && trailing.split("\\s+").length <= 4) {
                return trailing;
            }
        }

        Matcher rawMatcher = RAW_BUDGET_PATTERN.matcher(message);
        if (rawMatcher.find()) {
            String trailing = cleanField(message.substring(rawMatcher.end()));
            if (!trailing.isBlank() && trailing.split("\\s+").length <= 4) {
                return trailing;
            }
        }

        return "";
    }

    private String extractProduct(String original, String lower, String location, Integer budget) {
        String candidate = original;

        for (Pattern pattern : BUY_PATTERNS) {
            Matcher matcher = pattern.matcher(candidate);
            if (matcher.find()) {
                candidate = candidate.substring(matcher.end());
                break;
            }
        }

        candidate = LEADING_FILLER.matcher(candidate).replaceFirst("");
        candidate = stripBudget(candidate);

        if (!location.isBlank()) {
            candidate = candidate.replaceFirst("(?i)\\b(?:in|at|around|near|for delivery to|delivery to|to)\\s+" + Pattern.quote(location) + "\\b", "");
            candidate = candidate.replaceFirst("(?i)\\b" + Pattern.quote(location) + "\\b\\s*$", "");
        }

        candidate = candidate.replaceAll("(?i)\\bfor\\b\\s*$", "");
        candidate = cleanField(candidate);

        if (candidate.isBlank()) {
            return "";
        }

        return candidate.toLowerCase(Locale.ROOT);
    }

    private String stripBudget(String input) {
        String withoutK = K_BUDGET_PATTERN.matcher(input).replaceFirst(" ");
        return RAW_BUDGET_PATTERN.matcher(withoutK).replaceFirst(" ");
    }

    private String trimTrailingBudget(String input) {
        String value = stripBudget(input);
        return value.replaceAll("(?i)\\b(?:for|with|budget)\\b\\s*$", "");
    }

    private String cleanField(String input) {
        if (input == null) {
            return "";
        }

        String value = TRAILING_PUNCTUATION.matcher(input).replaceAll("");
        value = SPACE_PATTERN.matcher(value).replaceAll(" ").trim();
        return value;
    }

    private String normalizeWhitespace(String input) {
        return SPACE_PATTERN.matcher(input.trim()).replaceAll(" ");
    }

    private double parseNumber(String value) {
        try {
            DecimalFormatSymbols symbols = new DecimalFormatSymbols(Locale.US);
            DecimalFormat format = new DecimalFormat();
            format.setDecimalFormatSymbols(symbols);
            format.setParseBigDecimal(true);
            return format.parse(value.replace(",", "")).doubleValue();
        } catch (ParseException exception) {
            return 0;
        }
    }
}
