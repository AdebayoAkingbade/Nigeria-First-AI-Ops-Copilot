package com.kudipal.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AiService {

    @Autowired
    private WhatsAppMessagingService messagingService;

    public void answer(String phone, String message) {
        
        // Analyze cash/inventory based on DB records using an LLM
        
        // Flow 4: AI QUESTION
        String replyMessage = "You can restock small items, but your cash is low";
        messagingService.sendMessage(phone, replyMessage);
    }
}
