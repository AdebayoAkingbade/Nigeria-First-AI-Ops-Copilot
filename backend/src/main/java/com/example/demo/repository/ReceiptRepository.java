package com.example.demo.repository;

import com.example.demo.entity.Receipt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.UUID;

@Repository
public interface ReceiptRepository extends JpaRepository<Receipt, UUID> {
    
    @Query("SELECT r FROM Receipt r WHERE r.user_id = :userId ORDER BY r.created_at DESC")
    List<Receipt> findByUserId(@Param("userId") UUID userId);
}
