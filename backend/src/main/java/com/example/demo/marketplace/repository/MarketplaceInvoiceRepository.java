package com.example.demo.marketplace.repository;

import com.example.demo.marketplace.entity.MarketplaceInvoice;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface MarketplaceInvoiceRepository extends JpaRepository<MarketplaceInvoice, UUID> {
    Optional<MarketplaceInvoice> findByPaymentReference(String paymentReference);
}
