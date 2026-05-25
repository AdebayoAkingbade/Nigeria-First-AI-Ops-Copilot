package com.example.demo.controller;

import com.example.demo.marketplace.service.MarketplacePaymentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/webhook/paystack")
public class MarketplacePaystackWebhookController {

    private final MarketplacePaymentService marketplacePaymentService;

    public MarketplacePaystackWebhookController(MarketplacePaymentService marketplacePaymentService) {
        this.marketplacePaymentService = marketplacePaymentService;
    }

    @PostMapping
    public ResponseEntity<Void> receiveEvent(@RequestHeader(name = "x-paystack-signature", required = false) String signature,
                                             @RequestBody String rawBody) {
        boolean accepted = marketplacePaymentService.handleWebhook(rawBody, signature);
        return accepted ? ResponseEntity.ok().build() : ResponseEntity.status(400).build();
    }
}
