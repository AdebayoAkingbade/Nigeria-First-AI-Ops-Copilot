package com.example.demo.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Table;
import java.time.LocalDateTime;

@Entity
@Table(name = "receipts")
public class Receipt {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    private String user_id;
    private String storage_path;
    private String file_name;
    private String content_type;
    private String status;
    private LocalDateTime created_at;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getUser_id() { return user_id; }
    public void setUser_id(String user_id) { this.user_id = user_id; }
    public String getStorage_path() { return storage_path; }
    public void setStorage_path(String storage_path) { this.storage_path = storage_path; }
    public String getFile_name() { return file_name; }
    public void setFile_name(String file_name) { this.file_name = file_name; }
    public String getContent_type() { return content_type; }
    public void setContent_type(String content_type) { this.content_type = content_type; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public LocalDateTime getCreated_at() { return created_at; }
    public void setCreated_at(LocalDateTime created_at) { this.created_at = created_at; }
}
