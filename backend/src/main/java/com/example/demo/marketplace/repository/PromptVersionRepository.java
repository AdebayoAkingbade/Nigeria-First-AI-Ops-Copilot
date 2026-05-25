package com.example.demo.marketplace.repository;

import com.example.demo.marketplace.entity.PromptVersion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface PromptVersionRepository extends JpaRepository<PromptVersion, UUID> {
    Optional<PromptVersion> findFirstByActiveTrueOrderByCreatedAtDesc();
}
