package com.example.demo.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Table;
import java.time.LocalDateTime;

@Entity
@Table(name = "expenses")
public class Expense {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    private String user_id;
    private String merchant_name;
    private String category;
    private String amount;
    private String date;
    private LocalDateTime created_at;
    private LocalDateTime updated_at;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getUser_id() { return user_id; }
    public void setUser_id(String user_id) { this.user_id = user_id; }
    public String getMerchant_name() { return merchant_name; }
    public void setMerchant_name(String merchant_name) { this.merchant_name = merchant_name; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getAmount() { return amount; }
    public void setAmount(String amount) { this.amount = amount; }
    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }
}
