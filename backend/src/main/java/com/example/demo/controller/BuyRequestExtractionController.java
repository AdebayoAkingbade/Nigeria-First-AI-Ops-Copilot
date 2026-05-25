package com.example.demo.controller;

import com.example.demo.dto.BuyRequestExtractionRequest;
import com.example.demo.dto.BuyRequestIntentResponse;
import com.example.demo.service.BuyRequestExtractionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/webhook/whatsapp")
public class BuyRequestExtractionController {

    private final BuyRequestExtractionService extractionService;

    public BuyRequestExtractionController(BuyRequestExtractionService extractionService) {
        this.extractionService = extractionService;
    }

    @PostMapping("/extract")
    public ResponseEntity<BuyRequestIntentResponse> extract(@RequestBody BuyRequestExtractionRequest request) {
        String message = request == null ? null : request.getMessage();
        return ResponseEntity.ok(extractionService.extract(message));
    }
}
