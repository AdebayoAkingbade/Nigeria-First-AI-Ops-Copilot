package com.example.demo.marketplace.entity;

import com.example.demo.marketplace.enums.OrderStatus;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "orders", schema = "marketplace")
public class MarketplaceOrder extends BaseMarketplaceEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private MarketplaceUser user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id")
    private MarketplaceCustomer customer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "request_id")
    private BuyerRequest request;

    @Column(name = "buyer_phone", nullable = false, length = 32)
    private String buyerPhone;

    @Column(nullable = false)
    private String product;

    @Column(nullable = false)
    private int quantity = 1;

    @Column(nullable = false)
    private long amount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderStatus status = OrderStatus.PENDING_SELLER_ACCEPTANCE;

    @Column(name = "seller_note")
    private String sellerNote;

    public MarketplaceUser getUser() {
        return user;
    }

    public void setUser(MarketplaceUser user) {
        this.user = user;
    }

    public MarketplaceCustomer getCustomer() {
        return customer;
    }

    public void setCustomer(MarketplaceCustomer customer) {
        this.customer = customer;
    }

    public BuyerRequest getRequest() {
        return request;
    }

    public void setRequest(BuyerRequest request) {
        this.request = request;
    }

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

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public long getAmount() {
        return amount;
    }

    public void setAmount(long amount) {
        this.amount = amount;
    }

    public OrderStatus getStatus() {
        return status;
    }

    public void setStatus(OrderStatus status) {
        this.status = status;
    }

    public String getSellerNote() {
        return sellerNote;
    }

    public void setSellerNote(String sellerNote) {
        this.sellerNote = sellerNote;
    }
}
