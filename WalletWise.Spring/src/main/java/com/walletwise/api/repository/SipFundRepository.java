package com.walletwise.api.repository;

import com.walletwise.api.model.SipFund;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface SipFundRepository extends JpaRepository<SipFund, Integer> {
    List<SipFund> findByIsActiveTrueAndMinMonthlyAmountLessThanEqual(BigDecimal maxAmount);
}
