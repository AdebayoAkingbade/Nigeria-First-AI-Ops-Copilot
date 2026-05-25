package com.example.demo.marketplace.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "messages", schema = "marketplace")
public class MarketplaceMessage extends BaseMarketplaceEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private MarketplaceUser user;

    @Column(name = "conversation_phone", nullable = false, length = 32)
    private String conversationPhone;

    @Column(nullable = false, length = 10)
    private String direction;

    @Column(nullable = false, length = 20)
    private String sender;

    @Lob
    @Column(nullable = false)
    private String content;

    @Lob
    @Column(name = "metadata_json")
    private String metadataJson;

    public MarketplaceUser getUser() {
        return user;
    }

    public void setUser(MarketplaceUser user) {
        this.user = user;
    }

    public String getConversationPhone() {
        return conversationPhone;
    }

    public void setConversationPhone(String conversationPhone) {
        this.conversationPhone = conversationPhone;
    }

    public String getDirection() {
        return direction;
    }

    public void setDirection(String direction) {
        this.direction = direction;
    }

    public String getSender() {
        return sender;
    }

    public void setSender(String sender) {
        this.sender = sender;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getMetadataJson() {
        return metadataJson;
    }

    public void setMetadataJson(String metadataJson) {
        this.metadataJson = metadataJson;
    }
}
