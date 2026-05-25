package com.example.demo.service;

import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class WhatsAppService {

    @Value("${TWILIO_ACCOUNT_SID}")
    private String accountSid;

    @Value("${TWILIO_AUTH_TOKEN}")
    private String authToken;

    @Value("${TWILIO_WHATSAPP_NUMBER}")
    private String fromNumber;

    @PostConstruct
    public void init() {
        if (accountSid != null && !accountSid.isBlank()) {
            Twilio.init(accountSid, authToken);
        }
    }

    public void sendMessage(String toNumber, String body) {
        if (accountSid == null || accountSid.isBlank()) {
            System.err.println("Twilio not configured - would have sent: " + body);
            return;
        }

        try {
            // Ensure numbers are in E.164 format and prefixed with whatsapp:
            String formattedTo = toNumber.startsWith("whatsapp:") ? toNumber : "whatsapp:" + formatPhoneNumber(toNumber);
            String formattedFrom = fromNumber.startsWith("whatsapp:") ? fromNumber : "whatsapp:" + fromNumber;

            Message.creator(
                new PhoneNumber(formattedTo),
                new PhoneNumber(formattedFrom),
                body
            ).create();
            
            System.out.println("WhatsApp message sent to " + formattedTo);
        } catch (Exception e) {
            System.err.println("Failed to send WhatsApp message: " + e.getMessage());
            e.printStackTrace();
        }
    }

    private String formatPhoneNumber(String phone) {
        String clean = phone.replaceAll("[^0-9]", "");
        if (clean.startsWith("0")) {
            // Assume Nigeria for local 0xxx format if not specified
            return "234" + clean.substring(1);
        }
        return clean;
    }
}
