package com.example.demo.marketplace.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;

@Entity
@Table(name = "prompt_versions", schema = "marketplace")
public class PromptVersion extends BaseMarketplaceEntity {

    @Column(name = "version_label", nullable = false, unique = true)
    private String versionLabel;

    @Lob
    @Column(name = "prompt_text", nullable = false)
    private String promptText;

    @Lob
    private String notes;

    @Column(nullable = false)
    private boolean active;

    public String getVersionLabel() {
        return versionLabel;
    }

    public void setVersionLabel(String versionLabel) {
        this.versionLabel = versionLabel;
    }

    public String getPromptText() {
        return promptText;
    }

    public void setPromptText(String promptText) {
        this.promptText = promptText;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }
}
