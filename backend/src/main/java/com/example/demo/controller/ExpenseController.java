package com.example.demo.controller;

import com.example.demo.entity.Expense;
import com.example.demo.repository.ExpenseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {

    @Autowired
    private ExpenseRepository expenseRepository;

    @GetMapping
    public ResponseEntity<?> getMyExpenses(@AuthenticationPrincipal(expression = "subject") String userId) {
        try {
            return ResponseEntity.ok(expenseRepository.findByUserId(UUID.fromString(userId)));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(400).body("{\"error\":\"bad_request\",\"message\":\"Invalid user ID format\"}");
        }
    }

    @PostMapping
    public ResponseEntity<?> createExpense(@AuthenticationPrincipal(expression = "subject") String userId, @RequestBody Expense expense) {
        try {
            expense.setUser_id(UUID.fromString(userId));
            if (expense.getTransaction_date() == null && expense.getDate() != null) {
                expense.setTransaction_date(LocalDate.parse(expense.getDate()));
            }
            if (expense.getAmount() == null) {
                expense.setAmount(BigDecimal.ZERO);
            }
            if (expense.getCurrency() == null || expense.getCurrency().isBlank()) {
                expense.setCurrency("NGN");
            }
            if (expense.getCreated_at() == null) expense.setCreated_at(LocalDateTime.now());
            expense.setUpdated_at(LocalDateTime.now());
            
            Expense saved = expenseRepository.save(expense);
            return ResponseEntity.ok(saved);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(400).body("{\"error\":\"bad_request\",\"message\":\"Invalid user ID format\"}");
        }
    }
}
