package com.example.demo.marketplace.repository;

import com.example.demo.marketplace.entity.MarketplaceMessage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface MarketplaceMessageRepository extends JpaRepository<MarketplaceMessage, UUID> {
}
