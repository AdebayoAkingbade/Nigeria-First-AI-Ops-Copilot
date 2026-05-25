package com.kudipal.service;

import com.kudipal.dto.IntentResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class WhatsAppService {

    @Autowired
    private IntentService intentService;

    @Autowired
    private OrderService orderService;

    @Autowired
    private InvoiceService invoiceService;

    @Autowired
    private AiService aiService;

    public void handleIncomingMessage(String phone, String message) {

        IntentResult intent = intentService.detectIntent(message);

        if (intent.getType() == null) {
            return;
        }

        switch (intent.getType()) {
            case RECORD_SALE:
                orderService.recordSale(phone, intent);
                break;

            case CREATE_INVOICE:
                invoiceService.createInvoice(phone, intent);
                break;

            case ASK_QUESTION:
                aiService.answer(phone, message);
                break;
                
            default:
                // Handle OTHER intents or log
                break;
        }
    }
}
