package com.example.demo.marketplace.repository;

import com.example.demo.marketplace.entity.MarketplaceTransaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface MarketplaceTransactionRepository extends JpaRepository<MarketplaceTransaction, UUID> {
}
