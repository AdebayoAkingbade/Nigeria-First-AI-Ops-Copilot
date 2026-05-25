package com.example.demo.marketplace.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.Map;

@Service
public class WhatsAppCloudApiService {

    private final RestClient restClient;

    @Value("${whatsapp.cloud.api-version:v23.0}")
    private String apiVersion;

    @Value("${whatsapp.cloud.access-token:}")
    private String accessToken;

    @Value("${whatsapp.cloud.phone-number-id:}")
    private String phoneNumberId;

    public WhatsAppCloudApiService() {
        this.restClient = RestClient.builder().baseUrl("https://graph.facebook.com").build();
    }

    public boolean sendTextMessage(String to, String body) {
        if (accessToken == null || accessToken.isBlank() || phoneNumberId == null || phoneNumberId.isBlank()) {
            System.out.println("WhatsApp Cloud API not configured - would have sent to " + to + ": " + body);
            return false;
        }

        try {
            restClient.post()
                .uri("/{version}/{phoneNumberId}/messages", apiVersion, phoneNumberId)
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken)
                .contentType(MediaType.APPLICATION_JSON)
                .body(Map.of(
                    "messaging_product", "whatsapp",
                    "to", to,
                    "type", "text",
                    "text", Map.of("preview_url", false, "body", body)
                ))
                .retrieve()
                .toBodilessEntity();
            return true;
        } catch (Exception exception) {
            System.err.println("Failed to send WhatsApp Cloud API message: " + exception.getMessage());
            return false;
        }
    }
}
