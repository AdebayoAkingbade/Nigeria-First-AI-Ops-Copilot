package com.example.demo.marketplace.repository;

import com.example.demo.marketplace.entity.MarketplaceOrder;
import com.example.demo.marketplace.enums.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;
import java.util.UUID;

public interface MarketplaceOrderRepository extends JpaRepository<MarketplaceOrder, UUID> {
    List<MarketplaceOrder> findByStatusInAndUpdatedAtBefore(Collection<OrderStatus> statuses, LocalDateTime before);
}
