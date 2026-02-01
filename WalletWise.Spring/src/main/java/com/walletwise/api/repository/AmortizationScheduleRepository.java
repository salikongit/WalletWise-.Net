package com.walletwise.api.repository;

import com.walletwise.api.model.AmortizationSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface AmortizationScheduleRepository extends JpaRepository<AmortizationSchedule, Integer> {
    List<AmortizationSchedule> findByLoanId(Integer loanId);

    @Modifying
    @Transactional
    @Query("DELETE FROM AmortizationSchedule a WHERE a.loanId = :loanId")
    void deleteByLoanId(Integer loanId);
}
