package com.example.demo.marketplace.repository;

import com.example.demo.marketplace.entity.MarketplaceCustomer;
import com.example.demo.marketplace.entity.MarketplaceUser;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface MarketplaceCustomerRepository extends JpaRepository<MarketplaceCustomer, UUID> {
    Optional<MarketplaceCustomer> findByUserAndPhone(MarketplaceUser user, String phone);
}
