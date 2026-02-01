package com.walletwise.api.repository;

import com.walletwise.api.model.UserOnboardingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserOnboardingStatusRepository extends JpaRepository<UserOnboardingStatus, Integer> {
    Optional<UserOnboardingStatus> findByUserId(Integer userId);
}
