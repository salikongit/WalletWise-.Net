package com.walletwise.api.service;

import com.walletwise.api.dto.InvestmentOptionDto;
import com.walletwise.api.dto.InvestmentSuggestionResponseDto;
import com.walletwise.api.dto.RiskBenefitDto;
import com.walletwise.api.model.*;
import com.walletwise.api.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RecommendationService {

    @Autowired
    private UserOnboardingStatusRepository onboardingStatusRepository;
    @Autowired
    private IncomeRepository incomeRepository;
    @Autowired
    private ExpenseRepository expenseRepository;
    @Autowired
    private LoanRepository loanRepository;
    @Autowired
    private SipFundRepository sipFundRepository;
    @Autowired
    private EquityStockRepository equityStockRepository;
    @Autowired
    private FixedDepositRepository fixedDepositRepository;
    @Autowired
    private StockService stockService; // For reusable RiskBenefit logic

    public InvestmentSuggestionResponseDto getRecommendations(Integer userId) {
        UserOnboardingStatus onboarding = onboardingStatusRepository.findByUserId(userId).orElse(null);
        if (onboarding == null || onboarding.getSelectedInvestmentType() == null) {
            throw new RuntimeException("Onboarding not completed.");
        }

        BigDecimal remainingIncome = getRemainingIncome(userId);
        InvestmentType type = onboarding.getSelectedInvestmentType();

        List<InvestmentOptionDto> options;
        switch (type) {
            case SIP:
            case Lumpsum: // Reusing SIP options for Lumpsum as per .NET logic (Wait, .NET reused GetSipOptions logic for Lumpsum? Let's check. Yes: "InvestmentType.Lumpsum => await GetSipOptions(remainingIncome)")
                options = getSipOptions(remainingIncome);
                break;
            case Equity:
                options = getEquityOptions(remainingIncome);
                break;
            case FD:
                options = getFdOptions(remainingIncome);
                break;
            default:
                options = new ArrayList<>();
        }

        InvestmentSuggestionResponseDto response = new InvestmentSuggestionResponseDto();
        response.setRemainingIncome(remainingIncome);
        response.setInvestmentType(type);
        response.setInvestmentTypeName(type.toString());
        response.setInvestmentOptions(options);
        response.setRiskBenefit(stockService.getRiskBenefit(type));
        return response;
    }

    private BigDecimal getRemainingIncome(Integer userId) {
        BigDecimal income = incomeRepository.findByUserId(userId).stream()
                .map(Income::getAmount).reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal expenses = expenseRepository.findByUserId(userId).stream()
                .map(Expense::getAmount).reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal emi = loanRepository.findByUserId(userId).stream()
                .map(l -> l.getEmiAmount() != null ? l.getEmiAmount() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        return income.subtract(expenses).subtract(emi);
    }

    private List<InvestmentOptionDto> getSipOptions(BigDecimal budget) {
        return sipFundRepository.findByIsActiveTrueAndMinMonthlyAmountLessThanEqual(budget).stream()
                .map(s -> {
                    InvestmentOptionDto dto = new InvestmentOptionDto();
                    dto.setName(s.getFundName());
                    dto.setMinInvestment(s.getMinMonthlyAmount());
                    dto.setMaxInvestment(budget); // Or s.getMaxMonthlyAmount()
                    dto.setExpectedReturn(s.getExpectedReturn());
                    dto.setCategory("SIP");
                    return dto;
                })
                .collect(Collectors.toList());
    }

    private List<InvestmentOptionDto> getEquityOptions(BigDecimal budget) {
         return equityStockRepository.findByIsActiveTrueAndCurrentPriceLessThanEqual(budget).stream()
                .map(e -> {
                    InvestmentOptionDto dto = new InvestmentOptionDto();
                    dto.setSymbol(e.getSymbol());
                    dto.setName(e.getCompanyName());
                    dto.setCategory("Equity");
                    dto.setPrice(e.getCurrentPrice());
                    dto.setMinInvestment(e.getCurrentPrice());
                    dto.setMaxInvestment(budget);
                    dto.setCategory("Equity");
                    return dto;
                })
                 .collect(Collectors.toList());
    }

    private List<InvestmentOptionDto> getFdOptions(BigDecimal budget) {
        return fixedDepositRepository.findByIsActiveTrueAndMinInvestmentLessThanEqual(budget).stream()
                .map(f -> {
                    InvestmentOptionDto dto = new InvestmentOptionDto();
                    dto.setName(f.getBankName());
                    dto.setMinInvestment(f.getMinInvestment());
                    dto.setMaxInvestment(f.getMaxInvestment());
                    dto.setExpectedReturn(f.getInterestRate());
                    dto.setCategory("FD");
                    return dto;
                })
                .collect(Collectors.toList());
    }
}
