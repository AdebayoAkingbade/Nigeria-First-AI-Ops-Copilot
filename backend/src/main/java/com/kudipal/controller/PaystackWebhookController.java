package com.kudipal.controller;

import com.kudipal.service.WhatsAppMessagingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/webhook/paystack")
public class PaystackWebhookController {

    @Autowired
    private WhatsAppMessagingService messagingService;

    @PostMapping
    public ResponseEntity<?> handlePayment(@RequestBody Map<String, Object> payload) {

        String status = (String) payload.get("status");

        // Paystack standard structure usually involves an "event" key like "charge.success"
        // Following simplified structure handling as per requirements
        boolean isSuccess = "success".equals(status) || 
                            "charge.success".equals(payload.get("event"));

        if (isSuccess) {
            // Update invoice in DB
            
            // Extract the amount appropriately from structure
            String amountStr = "30,000"; // fallback
            if (payload.containsKey("data")) {
                Map<String, Object> data = (Map<String, Object>) payload.get("data");
                if (data.containsKey("amount")) {
                    int koboAmount = (Integer) data.get("amount");
                    amountStr = String.valueOf(koboAmount / 100);
                }
            }

            // Notify user
            String phone = "2348012345678"; // E.g., Retrieve linked phone number from order metadata
            String message = "💰 Payment received!\n\n₦" + amountStr + " from Customer\n\nYour balance is now updated.";
            
            messagingService.sendMessage(phone, message);
        }

        return ResponseEntity.ok().build();
    }
}
