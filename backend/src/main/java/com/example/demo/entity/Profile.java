package com.example.demo.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;

@Entity
@Table(name = "profiles")
public class Profile {

    @Id
    private String id;
    
    private String email;
    private String full_name;
    private String business_name;
    private String business_type;
    private String industry;
    private String cac_registration_number;
    private String incorporation_date;
    private String business_size;
    private String monthly_revenue_range;
    private String business_goals;
    private String whatsapp_number;
    private String plan;
    private LocalDateTime plan_activated_at;
    private LocalDateTime created_at;
    private LocalDateTime updated_at;
    
    // Getters and Setters omitted for brevity in preview, using public getters internally if needed.
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getBusiness_name() { return business_name; }
    public void setBusiness_name(String business_name) { this.business_name = business_name; }
    public String getWhatsapp_number() { return whatsapp_number; }
    public void setWhatsapp_number(String whatsapp_number) { this.whatsapp_number = whatsapp_number; }
    public String getPlan() { return plan; }
    public void setPlan(String plan) { this.plan = plan; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    // Other getters and setters...
}
