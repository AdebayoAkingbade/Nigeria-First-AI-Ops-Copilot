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
    public String getFull_name() { return full_name; }
    public void setFull_name(String full_name) { this.full_name = full_name; }
    public String getBusiness_type() { return business_type; }
    public void setBusiness_type(String business_type) { this.business_type = business_type; }
    public String getIndustry() { return industry; }
    public void setIndustry(String industry) { this.industry = industry; }
    public String getCac_registration_number() { return cac_registration_number; }
    public void setCac_registration_number(String cac_registration_number) { this.cac_registration_number = cac_registration_number; }
    public String getIncorporation_date() { return incorporation_date; }
    public void setIncorporation_date(String incorporation_date) { this.incorporation_date = incorporation_date; }
    public String getBusiness_size() { return business_size; }
    public void setBusiness_size(String business_size) { this.business_size = business_size; }
    public String getMonthly_revenue_range() { return monthly_revenue_range; }
    public void setMonthly_revenue_range(String monthly_revenue_range) { this.monthly_revenue_range = monthly_revenue_range; }
    public String getBusiness_goals() { return business_goals; }
    public void setBusiness_goals(String business_goals) { this.business_goals = business_goals; }
    public LocalDateTime getPlan_activated_at() { return plan_activated_at; }
    public void setPlan_activated_at(LocalDateTime plan_activated_at) { this.plan_activated_at = plan_activated_at; }
    public LocalDateTime getCreated_at() { return created_at; }
    public void setCreated_at(LocalDateTime created_at) { this.created_at = created_at; }
    public LocalDateTime getUpdated_at() { return updated_at; }
    public void setUpdated_at(LocalDateTime updated_at) { this.updated_at = updated_at; }
}
