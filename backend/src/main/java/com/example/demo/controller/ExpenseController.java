package com.example.demo.controller;

import com.example.demo.entity.Expense;
import com.example.demo.repository.ExpenseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {

    @Autowired
    private ExpenseRepository expenseRepository;

    @GetMapping
    public ResponseEntity<?> getMyExpenses(@AuthenticationPrincipal String userId) {
        return ResponseEntity.ok(expenseRepository.findByUserId(userId));
    }

    @PostMapping
    public ResponseEntity<?> createExpense(@AuthenticationPrincipal String userId, @RequestBody Expense expense) {
        expense.setUser_id(userId);
        if (expense.getCreated_at() == null) expense.setCreated_at(LocalDateTime.now());
        expense.setUpdated_at(LocalDateTime.now());
        
        Expense saved = expenseRepository.save(expense);
        return ResponseEntity.ok(saved);
    }
}
