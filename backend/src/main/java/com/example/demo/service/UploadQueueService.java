package com.example.demo.service;

import com.example.demo.entity.Expense;
import com.example.demo.entity.Receipt;
import com.example.demo.entity.Transaction;
import com.example.demo.repository.ExpenseRepository;
import com.example.demo.repository.ReceiptRepository;
import com.example.demo.repository.TransactionRepository;
import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.LinkedBlockingQueue;

@Service
public class UploadQueueService {

    private final BlockingQueue<UUID> queue = new LinkedBlockingQueue<>();
    private final ExecutorService executorService = Executors.newSingleThreadExecutor();

    private final ReceiptRepository receiptRepository;
    private final TransactionRepository transactionRepository;
    private final ExpenseRepository expenseRepository;
    private final UploadStorageService uploadStorageService;
    private final TransactionExtractionService transactionExtractionService;

    public UploadQueueService(
        ReceiptRepository receiptRepository,
        TransactionRepository transactionRepository,
        ExpenseRepository expenseRepository,
        UploadStorageService uploadStorageService,
        TransactionExtractionService transactionExtractionService
    ) {
        this.receiptRepository = receiptRepository;
        this.transactionRepository = transactionRepository;
        this.expenseRepository = expenseRepository;
        this.uploadStorageService = uploadStorageService;
        this.transactionExtractionService = transactionExtractionService;
    }

    @PostConstruct
    public void startWorker() {
        executorService.submit(() -> {
            while (!Thread.currentThread().isInterrupted()) {
                try {
                    process(queue.take());
                } catch (InterruptedException interruptedException) {
                    Thread.currentThread().interrupt();
                }
            }
        });
    }

    @PreDestroy
    public void stopWorker() {
        executorService.shutdownNow();
    }

    public void enqueue(UUID receiptId) {
        queue.offer(receiptId);
    }

    private void process(UUID receiptId) {
        Receipt receipt = receiptRepository.findById(receiptId)
            .orElseThrow(() -> new IllegalArgumentException("Upload job not found: " + receiptId));

        receipt.setStatus("processing");
        receiptRepository.save(receipt);

        try {
            List<Transaction> transactions = transactionExtractionService.extract(
                receipt.getUser_id(),
                receipt.getId(),
                receipt.getFile_name(),
                uploadStorageService.resolve(receipt.getStorage_path())
            );

            if (!transactions.isEmpty()) {
                transactionRepository.saveAll(transactions);
                saveExpenses(transactions);
            }

            receipt.setStatus("completed");
            receiptRepository.save(receipt);
        } catch (Exception exception) {
            receipt.setStatus("error");
            receiptRepository.save(receipt);
        }
    }

    private void saveExpenses(List<Transaction> transactions) {
        List<Expense> expenses = transactions.stream()
            .filter(transaction -> "out".equalsIgnoreCase(transaction.getDirection()))
            .map(transaction -> {
                Expense expense = new Expense();
                expense.setUser_id(transaction.getUser_id());
                expense.setReceipt_id(transaction.getReceipt_id());
                expense.setMerchant_name(transaction.getMerchant_name());
                expense.setCategory(transaction.getCategory());
                expense.setAmount(transaction.getAmount());
                expense.setTransaction_date(transaction.getTransaction_date());
                expense.setDescription(transaction.getDescription());
                expense.setCurrency(transaction.getCurrency());
                expense.setCreated_at(LocalDateTime.now());
                return expense;
            })
            .toList();

        if (!expenses.isEmpty()) {
            expenseRepository.saveAll(expenses);
        }
    }
}
