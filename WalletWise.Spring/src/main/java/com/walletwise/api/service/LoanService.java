package com.walletwise.api.service;

import com.walletwise.api.dto.EmiCalculationDto;
import com.walletwise.api.dto.EmiResponseDto;
import com.walletwise.api.dto.LoanDto;
import com.walletwise.api.model.AmortizationSchedule;
import com.walletwise.api.model.Loan;
import com.walletwise.api.model.User;
import com.walletwise.api.repository.AmortizationScheduleRepository;
import com.walletwise.api.repository.LoanRepository;
import com.walletwise.api.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class LoanService {

    @Autowired
    private LoanRepository loanRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private AmortizationScheduleRepository amortizationScheduleRepository;
    @Autowired
    private FinancialCalculationService calculationService;

    @Transactional
    public LoanDto createLoan(Integer userId, LoanDto dto) {
        EmiResponseDto emiCalc = calculationService.calculateEmi(new EmiCalculationDto(
                dto.getPrincipalAmount(), dto.getInterestRate(), dto.getTenureMonths()
        ));

        User user = userRepository.getReferenceById(userId);
        Loan loan = new Loan();
        loan.setUser(user);
        loan.setLoanName(dto.getLoanName());
        loan.setPrincipalAmount(dto.getPrincipalAmount());
        loan.setInterestRate(dto.getInterestRate());
        loan.setTenureMonths(dto.getTenureMonths());
        loan.setEmiAmount(emiCalc.getEmiAmount());
        loan.setCreatedAt(LocalDateTime.now());

        Loan savedLoan = loanRepository.save(loan);

        // Batch save schedule
        List<AmortizationSchedule> schedules = emiCalc.getAmortizationSchedule().stream()
                .map(s -> {
                    AmortizationSchedule schedule = new AmortizationSchedule();
                    schedule.setLoan(savedLoan);
                    schedule.setMonth(s.getMonth());
                    schedule.setPrincipal(s.getPrincipal());
                    schedule.setInterest(s.getInterest());
                    schedule.setBalance(s.getBalance());
                    return schedule;
                })
                .collect(Collectors.toList());
        
        amortizationScheduleRepository.saveAll(schedules);

        dto.setLoanId(savedLoan.getLoanId());
        dto.setEmiAmount(savedLoan.getEmiAmount());
        return dto;
    }

    public List<LoanDto> getUserLoans(Integer userId) {
        return loanRepository.findByUserId(userId).stream()
                .map(l -> {
                    LoanDto dto = new LoanDto();
                    dto.setLoanId(l.getLoanId());
                    dto.setLoanName(l.getLoanName());
                    dto.setPrincipalAmount(l.getPrincipalAmount());
                    dto.setInterestRate(l.getInterestRate());
                    dto.setTenureMonths(l.getTenureMonths());
                    dto.setEmiAmount(l.getEmiAmount());
                    return dto;
                })
                .collect(Collectors.toList());
    }
    public List<com.walletwise.api.dto.AmortizationScheduleDto> getLoanAmortization(Integer loanId) {
        return amortizationScheduleRepository.findByLoanId(loanId).stream()
                .map(s -> new com.walletwise.api.dto.AmortizationScheduleDto(
                        s.getMonth(),
                        s.getPrincipal(),
                        s.getInterest(),
                        s.getBalance()
                ))
                .collect(Collectors.toList());
    }
}
