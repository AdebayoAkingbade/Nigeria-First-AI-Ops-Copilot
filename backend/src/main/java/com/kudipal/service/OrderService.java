package com.kudipal.service;

import com.kudipal.dto.IntentResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class OrderService {

    @Autowired
    private WhatsAppMessagingService messagingService;

    public void recordSale(String phone, IntentResult intent) {
        
        // Save Order to DB
        // Example logic:
        // Order order = new Order();
        // order.setAmount(intent.getAmount());
        // order.setProduct(intent.getProduct());
        // order.setQuantity(intent.getQuantity());
        // orderRepository.save(order);

        // Reply Flow 1: RECORD SALE
        String replyMessage = "✅ Sale recorded\n\nDo you want to send invoice?\n1 → Yes\n2 → No";
        messagingService.sendMessage(phone, replyMessage);
    }
}
