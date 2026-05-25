package com.example.demo.marketplace.service;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

class MarketplacePhoneNumberServiceTest {

    private final MarketplacePhoneNumberService service = new MarketplacePhoneNumberService();

    @Test
    void normalizesLocalNigerianPhoneNumbers() {
        assertEquals("2348012345678", service.normalize("08012345678"));
    }

    @Test
    void stripsWhatsappPrefixAndSymbols() {
        assertEquals("2348012345678", service.normalize("whatsapp:+234 801 234 5678"));
    }
}
