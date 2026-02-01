package com.walletwise.api.repository;

import com.walletwise.api.model.Investment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InvestmentRepository extends JpaRepository<Investment, Integer> {
    List<Investment> findByUserId(Integer userId);
}
