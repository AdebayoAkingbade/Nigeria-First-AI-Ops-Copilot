package com.example.demo.marketplace.repository;

import com.example.demo.marketplace.entity.BuyerRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface BuyerRequestRepository extends JpaRepository<BuyerRequest, UUID> {
}
