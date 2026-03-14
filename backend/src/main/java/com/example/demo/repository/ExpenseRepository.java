package com.example.demo.repository;

import com.example.demo.entity.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, String> {
    
    @Query("SELECT e FROM Expense e WHERE e.user_id = :userId ORDER BY e.created_at DESC")
    List<Expense> findByUserId(@Param("userId") String userId);
}
