package com.kudipal.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class PaymentService {

    private final RestTemplate restTemplate;

    @Value("${paystack.secret.key:YOUR_SECRET_KEY}")
    private String paystackSecretKey;

    public PaymentService() {
        // For production, inject a customized RestTemplate bean
        this.restTemplate = new RestTemplate();
    }

    public String createPaymentLink(int amount, String email) {
        String url = "https://api.paystack.co/transaction/initialize";

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(paystackSecretKey);

        Map<String, Object> body = new HashMap<>();
        body.put("amount", amount * 100); // kobo
        body.put("email", email);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(url, request, Map.class);

            if (response.getBody() != null && response.getBody().containsKey("data")) {
                Map<String, Object> data = (Map<String, Object>) response.getBody().get("data");
                return (String) data.get("authorization_url");
            }
        } catch (Exception e) {
            System.err.println("Failed to connect to paystack: " + e.getMessage());
        }
        
        return null;
    }
}
