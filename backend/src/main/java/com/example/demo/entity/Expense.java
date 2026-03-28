package com.example.demo.entity;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "expenses")
public class Expense {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    private UUID user_id;
    private UUID receipt_id;
    private String merchant_name;
    private String category;
    private BigDecimal amount;
    private String currency;
    private LocalDate transaction_date;
    private String description;
    private LocalDateTime created_at;
    private LocalDateTime updated_at;

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public UUID getUser_id() { return user_id; }
    public void setUser_id(UUID user_id) { this.user_id = user_id; }
    public UUID getReceipt_id() { return receipt_id; }
    public void setReceipt_id(UUID receipt_id) { this.receipt_id = receipt_id; }
    public String getMerchant_name() { return merchant_name; }
    public void setMerchant_name(String merchant_name) { this.merchant_name = merchant_name; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }
    public LocalDate getTransaction_date() { return transaction_date; }
    public void setTransaction_date(LocalDate transaction_date) { this.transaction_date = transaction_date; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public LocalDateTime getCreated_at() { return created_at; }
    public void setCreated_at(LocalDateTime created_at) { this.created_at = created_at; }
    public LocalDateTime getUpdated_at() { return updated_at; }
    public void setUpdated_at(LocalDateTime updated_at) { this.updated_at = updated_at; }

    @JsonProperty("date")
    public String getDate() {
        return transaction_date == null ? null : transaction_date.toString();
    }

    @JsonAlias("date")
    public void setDate(String date) {
        if (date == null || date.isBlank()) {
            this.transaction_date = null;
            return;
        }
        this.transaction_date = LocalDate.parse(date);
    }
}
