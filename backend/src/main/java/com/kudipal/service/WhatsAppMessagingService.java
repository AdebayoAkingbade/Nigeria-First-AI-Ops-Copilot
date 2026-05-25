package com.kudipal.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class WhatsAppMessagingService {
    
    private final RestTemplate restTemplate;

    @Value("${meta.whatsapp.phone.id:YOUR_PHONE_ID}")
    private String phoneId;

    @Value("${meta.whatsapp.token:YOUR_ACCESS_TOKEN}")
    private String accessToken;

    public WhatsAppMessagingService() {
        this.restTemplate = new RestTemplate();
    }

    public void sendMessage(String phone, String text) {
        // Step 6: Send Test Message to Meta Graph API
        String url = "https://graph.facebook.com/v18.0/" + phoneId + "/messages";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(accessToken);

        // Construct standard Meta WhatsApp Messaging payload
        Map<String, Object> textObj = new HashMap<>();
        textObj.put("preview_url", false);
        textObj.put("body", text);

        Map<String, Object> body = new HashMap<>();
        body.put("messaging_product", "whatsapp");
        body.put("recipient_type", "individual");
        body.put("to", phone);
        body.put("type", "text");
        body.put("text", textObj);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

        try {
            restTemplate.postForEntity(url, request, String.class);
            System.out.println("---- WHATSAPP MESSAGE SENT ----\nTo: " + phone);
        } catch (Exception e) {
            System.err.println("Failed to send WhatsApp message via Meta API: " + e.getMessage());
        }
    }
}
