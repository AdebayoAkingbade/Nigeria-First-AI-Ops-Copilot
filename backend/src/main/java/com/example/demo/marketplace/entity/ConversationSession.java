package com.example.demo.marketplace.entity;

import com.example.demo.marketplace.enums.ConversationRole;
import com.example.demo.marketplace.enums.ConversationState;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import java.time.LocalDateTime;

@Entity
@Table(name = "conversation_sessions", schema = "marketplace")
public class ConversationSession extends BaseMarketplaceEntity {

    @Column(nullable = false, unique = true, length = 32)
    private String phone;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ConversationRole role;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ConversationState state = ConversationState.IDLE;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "active_request_id")
    private BuyerRequest activeRequest;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "active_order_id")
    private MarketplaceOrder activeOrder;

    @Lob
    @Column(name = "option_payload_json")
    private String optionPayloadJson;

    @Column(name = "last_inbound_at")
    private LocalDateTime lastInboundAt;

    @Column(name = "last_outbound_at")
    private LocalDateTime lastOutboundAt;

    @Column(name = "reminder_sent_at")
    private LocalDateTime reminderSentAt;

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public ConversationRole getRole() {
        return role;
    }

    public void setRole(ConversationRole role) {
        this.role = role;
    }

    public ConversationState getState() {
        return state;
    }

    public void setState(ConversationState state) {
        this.state = state;
    }

    public BuyerRequest getActiveRequest() {
        return activeRequest;
    }

    public void setActiveRequest(BuyerRequest activeRequest) {
        this.activeRequest = activeRequest;
    }

    public MarketplaceOrder getActiveOrder() {
        return activeOrder;
    }

    public void setActiveOrder(MarketplaceOrder activeOrder) {
        this.activeOrder = activeOrder;
    }

    public String getOptionPayloadJson() {
        return optionPayloadJson;
    }

    public void setOptionPayloadJson(String optionPayloadJson) {
        this.optionPayloadJson = optionPayloadJson;
    }

    public LocalDateTime getLastInboundAt() {
        return lastInboundAt;
    }

    public void setLastInboundAt(LocalDateTime lastInboundAt) {
        this.lastInboundAt = lastInboundAt;
    }

    public LocalDateTime getLastOutboundAt() {
        return lastOutboundAt;
    }

    public void setLastOutboundAt(LocalDateTime lastOutboundAt) {
        this.lastOutboundAt = lastOutboundAt;
    }

    public LocalDateTime getReminderSentAt() {
        return reminderSentAt;
    }

    public void setReminderSentAt(LocalDateTime reminderSentAt) {
        this.reminderSentAt = reminderSentAt;
    }
}
