package com.example.demo.service;

import com.example.demo.dto.BuyRequestIntentResponse;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

class BuyRequestExtractionServiceTest {

    private final BuyRequestExtractionService service = new BuyRequestExtractionService();

    @Test
    void extractsPidginBuyRequestWithKBudget() {
        BuyRequestIntentResponse response = service.extract("I wan buy timberland brown shoe 35k Lekki");

        assertEquals("BUY_REQUEST", response.getIntent());
        assertEquals("timberland brown shoe", response.getProduct());
        assertEquals(35000, response.getBudget());
        assertEquals("Lekki", response.getLocation());
    }

    @Test
    void extractsLocationWithPrepositionAndCommaBudget() {
        BuyRequestIntentResponse response = service.extract("Please, I need brown shoe in Ajah for 42,500");

        assertEquals("BUY_REQUEST", response.getIntent());
        assertEquals("brown shoe", response.getProduct());
        assertEquals(42500, response.getBudget());
        assertEquals("Ajah", response.getLocation());
    }

    @Test
    void returnsUnknownForNonBuyMessages() {
        BuyRequestIntentResponse response = service.extract("How market today?");

        assertEquals("UNKNOWN", response.getIntent());
        assertEquals("", response.getProduct());
        assertEquals(0, response.getBudget());
        assertEquals("", response.getLocation());
    }
}
