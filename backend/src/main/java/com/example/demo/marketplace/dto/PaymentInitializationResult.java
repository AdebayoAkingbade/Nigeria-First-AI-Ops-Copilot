package com.example.demo.marketplace.dto;

public class PaymentInitializationResult {
    private final String paymentLink;
    private final String reference;
    private final boolean live;

    public PaymentInitializationResult(String paymentLink, String reference, boolean live) {
        this.paymentLink = paymentLink;
        this.reference = reference;
        this.live = live;
    }

    public String getPaymentLink() {
        return paymentLink;
    }

    public String getReference() {
        return reference;
    }

    public boolean isLive() {
        return live;
    }
}
