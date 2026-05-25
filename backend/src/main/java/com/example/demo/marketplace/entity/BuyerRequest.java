package com.example.demo.marketplace.entity;

import com.example.demo.marketplace.enums.RequestStatus;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "requests", schema = "marketplace")
public class BuyerRequest extends BaseMarketplaceEntity {

    @Column(name = "buyer_phone", nullable = false, length = 32)
    private String buyerPhone;

    @Column(nullable = false)
    private String product;

    @Column(nullable = false)
    private long budget;

    @Column(nullable = false)
    private String location;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RequestStatus status = RequestStatus.OPEN;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "matched_user_id")
    private MarketplaceUser matchedUser;

    public String getBuyerPhone() {
        return buyerPhone;
    }

    public void setBuyerPhone(String buyerPhone) {
        this.buyerPhone = buyerPhone;
    }

    public String getProduct() {
        return product;
    }

    public void setProduct(String product) {
        this.product = product;
    }

    public long getBudget() {
        return budget;
    }

    public void setBudget(long budget) {
        this.budget = budget;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public RequestStatus getStatus() {
        return status;
    }

    public void setStatus(RequestStatus status) {
        this.status = status;
    }

    public MarketplaceUser getMatchedUser() {
        return matchedUser;
    }

    public void setMatchedUser(MarketplaceUser matchedUser) {
        this.matchedUser = matchedUser;
    }
}
