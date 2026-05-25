package com.example.demo.marketplace.repository;

import com.example.demo.marketplace.entity.MarketplaceProduct;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface MarketplaceProductRepository extends JpaRepository<MarketplaceProduct, UUID> {
    List<MarketplaceProduct> findByActiveTrue();
}
