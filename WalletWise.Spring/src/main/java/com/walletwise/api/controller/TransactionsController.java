package com.walletwise.api.controller;

import com.walletwise.api.dto.ExpenseDto;
import com.walletwise.api.dto.IncomeDto;
import com.walletwise.api.model.User;
import com.walletwise.api.repository.UserRepository;
import com.walletwise.api.service.TransactionService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping({"/api/Transactions", "/api/transactions"})
@Tag(name = "Transactions")
public class TransactionsController {

    @Autowired
    private TransactionService transactionService;
    @Autowired
    private UserRepository userRepository;

    private Integer getUserId(Authentication auth) {
        String email = auth.getName();
        return userRepository.findByEmail(email).orElseThrow().getUserId();
    }

    @GetMapping("/income")
    public ResponseEntity<List<IncomeDto>> getIncomes(
            Authentication auth,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        return ResponseEntity.ok(transactionService.getIncomes(getUserId(auth), startDate, endDate));
    }

    @GetMapping("/expense")
    public ResponseEntity<List<ExpenseDto>> getExpenses(
            Authentication auth,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        return ResponseEntity.ok(transactionService.getExpenses(getUserId(auth), startDate, endDate));
    }

    @PostMapping("/income")
    public ResponseEntity<?> addIncome(Authentication auth, @RequestBody IncomeDto dto) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(transactionService.addIncome(getUserId(auth), dto));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/expense")
    public ResponseEntity<?> addExpense(Authentication auth, @RequestBody ExpenseDto dto) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(transactionService.addExpense(getUserId(auth), dto));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/income/{id}")
    public ResponseEntity<?> updateIncome(Authentication auth, @PathVariable Integer id, @RequestBody IncomeDto dto) {
        try {
            return ResponseEntity.ok(transactionService.updateIncome(getUserId(auth), id, dto));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/income/{id}")
    public ResponseEntity<?> deleteIncome(Authentication auth, @PathVariable Integer id) {
        try {
            transactionService.deleteIncome(getUserId(auth), id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/expense/{id}")
    public ResponseEntity<?> updateExpense(Authentication auth, @PathVariable Integer id, @RequestBody ExpenseDto dto) {
        try {
            return ResponseEntity.ok(transactionService.updateExpense(getUserId(auth), id, dto));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/expense/{id}")
    public ResponseEntity<?> deleteExpense(Authentication auth, @PathVariable Integer id) {
        try {
            transactionService.deleteExpense(getUserId(auth), id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    // Update/Delete not strictly in snippet but good to have
    // I will skip implementation of Update/Delete if not critical, but snippet showed them.
    // I'll add stub or skip to save space as basic flow is covered. 
    // Wait, the prompt implies full migration. I should add them if possible.
    // Logic was simple.
}
