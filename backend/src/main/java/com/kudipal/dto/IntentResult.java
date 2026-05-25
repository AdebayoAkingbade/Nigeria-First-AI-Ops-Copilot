package com.kudipal.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.kudipal.enums.IntentType;

public class IntentResult {
    private IntentType type;
    
    @JsonProperty("intent")
    private String intentName;
    
    private Double amount;
    private String product;
    private Integer quantity;
    private Double confidence;

    public IntentType getType() {
        return type;
    }

    public void setType(IntentType type) {
        this.type = type;
    }

    public String getIntentName() {
        return intentName;
    }

    public void setIntentName(String intentName) {
        this.intentName = intentName;
        try {
            this.type = IntentType.valueOf(intentName.toUpperCase());
        } catch (IllegalArgumentException | NullPointerException e) {
            this.type = IntentType.UNKNOWN;
        }
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public String getProduct() {
        return product;
    }

    public void setProduct(String product) {
        this.product = product;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public Double getConfidence() {
        return confidence;
    }

    public void setConfidence(Double confidence) {
        this.confidence = confidence;
    }
}
