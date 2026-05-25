package com.kudipal.service;

import com.kudipal.dto.IntentResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class InvoiceService {

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private WhatsAppMessagingService messagingService;

    public void createInvoice(String phone, IntentResult intent) {

        // Create Invoice in DB logic here

        // Safely extract numeric amount
        int amountInNaira = 0;
        if (intent.getAmount() != null) {
            amountInNaira = intent.getAmount().intValue();
        }

        // Fetch user's email or business email
        String email = "customer@domain.com";

        // Generate Paystack Link
        String paymentLink = paymentService.createPaymentLink(amountInNaira, email);
        if (paymentLink == null) {
            paymentLink = "[Pay Now Link]";
        }

        // Flow 2: INVOICE + PAYMENT
        String replyMessage = "📄 Invoice ready\n\nAmount: ₦" + amountInNaira + "\n" + paymentLink;
        messagingService.sendMessage(phone, replyMessage);
    }
}
