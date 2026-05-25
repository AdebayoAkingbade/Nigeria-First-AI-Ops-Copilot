package com.example.demo.marketplace.repository;

import com.example.demo.marketplace.entity.MarketplaceUser;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface MarketplaceUserRepository extends JpaRepository<MarketplaceUser, UUID> {
    Optional<MarketplaceUser> findByPhone(String phone);
}
