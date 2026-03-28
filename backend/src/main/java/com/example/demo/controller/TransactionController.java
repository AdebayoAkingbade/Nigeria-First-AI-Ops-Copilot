package com.example.demo.controller;

import com.example.demo.repository.TransactionRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    private final TransactionRepository transactionRepository;

    public TransactionController(TransactionRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    @GetMapping
    public ResponseEntity<?> getMyTransactions(@AuthenticationPrincipal(expression = "subject") String userId) {
        try {
            return ResponseEntity.ok(transactionRepository.findByUserId(UUID.fromString(userId)));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(400).body("{\"error\":\"bad_request\",\"message\":\"Invalid user ID format\"}");
        }
    }
}
