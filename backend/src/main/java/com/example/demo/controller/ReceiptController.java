package com.example.demo.controller;

import com.example.demo.entity.Receipt;
import com.example.demo.repository.ReceiptRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/receipts")
public class ReceiptController {

    @Autowired
    private ReceiptRepository receiptRepository;

    @GetMapping
    public ResponseEntity<?> getMyReceipts(@AuthenticationPrincipal(expression = "subject") String userId) {
        return ResponseEntity.ok(receiptRepository.findByUserId(userId));
    }
}
