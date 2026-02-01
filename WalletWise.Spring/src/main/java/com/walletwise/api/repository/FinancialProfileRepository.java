package com.walletwise.api.repository;

import com.walletwise.api.model.FinancialProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FinancialProfileRepository extends JpaRepository<FinancialProfile, Integer> {
    Optional<FinancialProfile> findByUserId(Integer userId);
}
