package com.walletwise.api.repository;

import com.walletwise.api.model.Otp;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OtpRepository extends JpaRepository<Otp, Integer> {
    Optional<Otp> findTopByUserIdOrderByCreatedAtDesc(Integer userId);
}
