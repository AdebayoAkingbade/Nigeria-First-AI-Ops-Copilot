package com.kudipal.controller;

import com.kudipal.dto.WhatsAppPayload;
import com.kudipal.service.WhatsAppService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/webhook/whatsapp")
public class WhatsAppWebhookController {

    private final WhatsAppService whatsappService;

    @Autowired
    public WhatsAppWebhookController(WhatsAppService whatsappService) {
        this.whatsappService = whatsappService;
    }

    // Step 5: Verify Webhook from Meta Dashboard
    @GetMapping
    public String verify(@RequestParam(name = "hub.challenge", required = false) String challenge,
                         @RequestParam(name = "hub.verify_token", required = false) String verifyToken) {
        
        // Ensure "kudipal123" matches the verify token assigned in your Meta dashboard
        if ("kudipal123".equals(verifyToken)) {
            return challenge;
        }
        return "Invalid verify token";
    }

    @PostMapping
    public ResponseEntity<?> receiveMessage(@RequestBody WhatsAppPayload payload) {

        String phone = payload.getPhone();
        String message = payload.getMessage();

        whatsappService.handleIncomingMessage(phone, message);

        return ResponseEntity.ok().build();
    }
}
