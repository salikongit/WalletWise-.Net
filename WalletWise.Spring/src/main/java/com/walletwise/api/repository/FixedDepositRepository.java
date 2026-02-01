package com.walletwise.api.repository;

import com.walletwise.api.model.FixedDeposit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface FixedDepositRepository extends JpaRepository<FixedDeposit, Integer> {
    List<FixedDeposit> findByIsActiveTrueAndMinInvestmentLessThanEqual(BigDecimal maxAmount);
}
