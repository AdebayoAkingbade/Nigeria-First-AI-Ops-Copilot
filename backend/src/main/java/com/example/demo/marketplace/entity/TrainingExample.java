package com.example.demo.marketplace.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import java.math.BigDecimal;

@Entity
@Table(name = "training_examples", schema = "marketplace")
public class TrainingExample extends BaseMarketplaceEntity {

    @Column(name = "raw_message", nullable = false)
    private String rawMessage;

    @Column(name = "detected_intent", nullable = false)
    private String detectedIntent;

    @Column(name = "extracted_product")
    private String extractedProduct;

    @Column(name = "extracted_budget", nullable = false)
    private long extractedBudget;

    @Column(name = "extracted_location")
    private String extractedLocation;

    @Column(nullable = false)
    private String source;

    @Column(nullable = false, precision = 4, scale = 3)
    private BigDecimal confidence = BigDecimal.ZERO;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "prompt_version_id")
    private PromptVersion promptVersion;

    public String getRawMessage() {
        return rawMessage;
    }

    public void setRawMessage(String rawMessage) {
        this.rawMessage = rawMessage;
    }

    public String getDetectedIntent() {
        return detectedIntent;
    }

    public void setDetectedIntent(String detectedIntent) {
        this.detectedIntent = detectedIntent;
    }

    public String getExtractedProduct() {
        return extractedProduct;
    }

    public void setExtractedProduct(String extractedProduct) {
        this.extractedProduct = extractedProduct;
    }

    public long getExtractedBudget() {
        return extractedBudget;
    }

    public void setExtractedBudget(long extractedBudget) {
        this.extractedBudget = extractedBudget;
    }

    public String getExtractedLocation() {
        return extractedLocation;
    }

    public void setExtractedLocation(String extractedLocation) {
        this.extractedLocation = extractedLocation;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public BigDecimal getConfidence() {
        return confidence;
    }

    public void setConfidence(BigDecimal confidence) {
        this.confidence = confidence;
    }

    public PromptVersion getPromptVersion() {
        return promptVersion;
    }

    public void setPromptVersion(PromptVersion promptVersion) {
        this.promptVersion = promptVersion;
    }
}
