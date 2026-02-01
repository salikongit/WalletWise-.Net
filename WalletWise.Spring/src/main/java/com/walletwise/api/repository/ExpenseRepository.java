package com.walletwise.api.repository;

import com.walletwise.api.model.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Integer> {
    List<Expense> findByUserId(Integer userId);

    @Query("SELECT e FROM Expense e WHERE e.userId = :userId AND (:startDate IS NULL OR e.expenseDate >= :startDate) AND (:endDate IS NULL OR e.expenseDate <= :endDate)")
    List<Expense> findByUserIdAndDateRange(@Param("userId") Integer userId, @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    @Query("SELECT SUM(e.amount) FROM Expense e WHERE e.userId = :userId AND (:startDate IS NULL OR e.expenseDate >= :startDate) AND (:endDate IS NULL OR e.expenseDate <= :endDate)")
    BigDecimal getTotalExpenseByUserIdAndDateRange(@Param("userId") Integer userId, @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
}
