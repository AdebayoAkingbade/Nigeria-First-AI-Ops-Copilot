package com.example.demo.dto;

public class BuyRequestIntentResponse {
    private String intent;
    private String product;
    private int budget;
    private String location;

    public BuyRequestIntentResponse() {
    }

    public BuyRequestIntentResponse(String intent, String product, int budget, String location) {
        this.intent = intent;
        this.product = product;
        this.budget = budget;
        this.location = location;
    }

    public String getIntent() {
        return intent;
    }

    public void setIntent(String intent) {
        this.intent = intent;
    }

    public String getProduct() {
        return product;
    }

    public void setProduct(String product) {
        this.product = product;
    }

    public int getBudget() {
        return budget;
    }

    public void setBudget(int budget) {
        this.budget = budget;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }
}
