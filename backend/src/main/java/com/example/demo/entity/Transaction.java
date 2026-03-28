package com.example.demo.entity;

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
@Table(name = "transactions")
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private UUID user_id;
    private UUID receipt_id;
    private String direction;
    private BigDecimal amount;
    private String currency;
    private String category;
    private String merchant_name;
    private String description;
    private LocalDate transaction_date;
    private String source_type;
    private LocalDateTime created_at;

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getUser_id() { return user_id; }
    public void setUser_id(UUID user_id) { this.user_id = user_id; }

    public UUID getReceipt_id() { return receipt_id; }
    public void setReceipt_id(UUID receipt_id) { this.receipt_id = receipt_id; }

    public String getDirection() { return direction; }
    public void setDirection(String direction) { this.direction = direction; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getMerchant_name() { return merchant_name; }
    public void setMerchant_name(String merchant_name) { this.merchant_name = merchant_name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public LocalDate getTransaction_date() { return transaction_date; }
    public void setTransaction_date(LocalDate transaction_date) { this.transaction_date = transaction_date; }

    public String getSource_type() { return source_type; }
    public void setSource_type(String source_type) { this.source_type = source_type; }

    public LocalDateTime getCreated_at() { return created_at; }
    public void setCreated_at(LocalDateTime created_at) { this.created_at = created_at; }
}
