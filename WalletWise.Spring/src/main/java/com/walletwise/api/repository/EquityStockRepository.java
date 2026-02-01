package com.walletwise.api.repository;

import com.walletwise.api.model.EquityStock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface EquityStockRepository extends JpaRepository<EquityStock, Integer> {
    List<EquityStock> findByIsActiveTrueAndCurrentPriceLessThanEqual(BigDecimal maxPrice);
}
