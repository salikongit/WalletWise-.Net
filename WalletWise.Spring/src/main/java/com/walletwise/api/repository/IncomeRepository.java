package com.walletwise.api.repository;

import com.walletwise.api.model.Income;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface IncomeRepository extends JpaRepository<Income, Integer> {
    List<Income> findByUserId(Integer userId);

    @Query("SELECT i FROM Income i WHERE i.userId = :userId AND (:startDate IS NULL OR i.incomeDate >= :startDate) AND (:endDate IS NULL OR i.incomeDate <= :endDate)")
    List<Income> findByUserIdAndDateRange(@Param("userId") Integer userId, @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    @Query("SELECT SUM(i.amount) FROM Income i WHERE i.userId = :userId AND (:startDate IS NULL OR i.incomeDate >= :startDate) AND (:endDate IS NULL OR i.incomeDate <= :endDate)")
    BigDecimal getTotalIncomeByUserIdAndDateRange(@Param("userId") Integer userId, @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
}
