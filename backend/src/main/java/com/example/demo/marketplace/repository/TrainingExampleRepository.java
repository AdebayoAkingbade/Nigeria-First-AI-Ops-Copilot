package com.example.demo.marketplace.repository;

import com.example.demo.marketplace.entity.TrainingExample;
import org.springframework.data.jpa.repository.JpaRepository;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public interface TrainingExampleRepository extends JpaRepository<TrainingExample, UUID> {
    List<TrainingExample> findTop20ByConfidenceGreaterThanEqualOrderByCreatedAtDesc(BigDecimal confidence);
    List<TrainingExample> findAllByOrderByCreatedAtAsc();
}
