package com.example.demo.marketplace.service;

import org.springframework.stereotype.Service;

@Service
public class MarketplacePhoneNumberService {

    public String normalize(String rawPhone) {
        if (rawPhone == null || rawPhone.isBlank()) {
            return "";
        }

        String clean = rawPhone.replace("whatsapp:", "").replaceAll("[^0-9]", "");
        if (clean.startsWith("0")) {
            return "234" + clean.substring(1);
        }
        if (clean.startsWith("234")) {
            return clean;
        }
        if (clean.length() == 10) {
            return "234" + clean;
        }
        return clean;
    }
}
