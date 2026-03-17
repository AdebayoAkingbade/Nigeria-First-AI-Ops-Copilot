package com.example.demo.controller;

import com.example.demo.entity.Profile;
import com.example.demo.repository.ProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/webhook/whatsapp")
public class WhatsAppWebhookController {

    @Autowired
    private ProfileRepository profileRepository;

    @Value("${twilio.account.sid:}")
    private String twilioAccountSid;

    @Value("${twilio.auth.token:}")
    private String twilioAuthToken;

    @Value("${twilio.whatsapp.number:}")
    private String twilioWhatsappNumber;

    @Value("${openai.api.key:}")
    private String openAiApiKey;

    @PostMapping(consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
    public ResponseEntity<?> receiveWhatsAppMessage(@RequestParam Map<String, String> body) {
        String from = body.get("From");
        String messageBody = body.get("Body");

        if (from == null || messageBody == null) {
            return ResponseEntity.badRequest().body("Invalid Payload");
        }

        System.out.println("Received WhatsApp message from " + from + ": " + messageBody);

        String senderPhone = from.replace("whatsapp:", "");

        // Find user by whatsapp number (requires custom query, but simplified here)
        // In a real app, we'd add findByWhatsappNumber to ProfileRepository
        Optional<Profile> profileOpt = profileRepository.findAll().stream()
                .filter(p -> senderPhone.equals(p.getWhatsapp_number()))
                .findFirst();

        if (profileOpt.isEmpty()) {
            System.out.println("Unrecognized user: " + senderPhone);
            // We would send a Twilio message ignoring for now indicating no connect
            return ResponseEntity.ok().build();
        }

        Profile profile = profileOpt.get();
        
        // TODO: Call OpenAI API using openAiApiKey and return via Twilio Client
        System.out.println("Would send response via Twilio to: " + profile.getBusiness_name());
        
        return ResponseEntity.ok().build();
    }
}
