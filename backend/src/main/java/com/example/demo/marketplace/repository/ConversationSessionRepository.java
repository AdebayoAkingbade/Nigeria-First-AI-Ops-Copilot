package com.example.demo.marketplace.repository;

import com.example.demo.marketplace.entity.ConversationSession;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface ConversationSessionRepository extends JpaRepository<ConversationSession, UUID> {
    Optional<ConversationSession> findByPhone(String phone);
}
