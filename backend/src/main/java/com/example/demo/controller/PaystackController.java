package com.example.demo.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/paystack")
public class PaystackController {

    @PostMapping("/verify-identity")
    public ResponseEntity<?> verifyIdentity(@AuthenticationPrincipal String userId) {
        // Implement Paystack BVN/Identity verification logic here
        // This replaces the Mono integration
        return ResponseEntity.ok(Map.of("status", "success", "message", "Identity verification endpoint ready."));
    }
}
