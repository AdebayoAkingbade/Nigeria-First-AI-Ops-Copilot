package com.example.demo.controller;

import com.example.demo.entity.Receipt;
import com.example.demo.repository.ReceiptRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/receipts")
public class ReceiptController {

    @Autowired
    private ReceiptRepository receiptRepository;

    @GetMapping
    public ResponseEntity<?> getMyReceipts(@AuthenticationPrincipal(expression = "subject") String userId) {
        try {
            return ResponseEntity.ok(receiptRepository.findByUserId(UUID.fromString(userId)));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(400).body("{\"error\":\"bad_request\",\"message\":\"Invalid user ID format\"}");
        }
    }
}
