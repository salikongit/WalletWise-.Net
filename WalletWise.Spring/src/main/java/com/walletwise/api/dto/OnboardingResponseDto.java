package com.walletwise.api.dto;

import java.math.BigDecimal;
import java.util.List;

public class OnboardingResponseDto {
    private boolean success;
    private String message;
    private BigDecimal remainingIncome;
    private InvestmentSuggestionDto investmentSuggestion;
    private List<InvestmentOptionDto> investmentOptions;
    private RiskBenefitDto riskBenefit;
    private boolean isOnboardingComplete;

    public OnboardingResponseDto() {
    }

    public OnboardingResponseDto(boolean success, String message, BigDecimal remainingIncome, InvestmentSuggestionDto investmentSuggestion, List<InvestmentOptionDto> investmentOptions, RiskBenefitDto riskBenefit, boolean isOnboardingComplete) {
        this.success = success;
        this.message = message;
        this.remainingIncome = remainingIncome;
        this.investmentSuggestion = investmentSuggestion;
        this.investmentOptions = investmentOptions;
        this.riskBenefit = riskBenefit;
        this.isOnboardingComplete = isOnboardingComplete;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public BigDecimal getRemainingIncome() {
        return remainingIncome;
    }

    public void setRemainingIncome(BigDecimal remainingIncome) {
        this.remainingIncome = remainingIncome;
    }

    public InvestmentSuggestionDto getInvestmentSuggestion() {
        return investmentSuggestion;
    }

    public void setInvestmentSuggestion(InvestmentSuggestionDto investmentSuggestion) {
        this.investmentSuggestion = investmentSuggestion;
    }

    public List<InvestmentOptionDto> getInvestmentOptions() {
        return investmentOptions;
    }

    public void setInvestmentOptions(List<InvestmentOptionDto> investmentOptions) {
        this.investmentOptions = investmentOptions;
    }

    public RiskBenefitDto getRiskBenefit() {
        return riskBenefit;
    }

    public void setRiskBenefit(RiskBenefitDto riskBenefit) {
        this.riskBenefit = riskBenefit;
    }

    public boolean isOnboardingComplete() {
        return isOnboardingComplete;
    }

    public void setOnboardingComplete(boolean isOnboardingComplete) {
        this.isOnboardingComplete = isOnboardingComplete;
    }
}
