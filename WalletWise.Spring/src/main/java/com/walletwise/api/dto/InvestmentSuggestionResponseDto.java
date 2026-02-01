package com.walletwise.api.dto;

import com.walletwise.api.model.InvestmentType;
import java.math.BigDecimal;
import java.util.List;

public class InvestmentSuggestionResponseDto {
    private BigDecimal remainingIncome;
    private InvestmentType investmentType;
    private String investmentTypeName;
    private List<InvestmentOptionDto> investmentOptions;
    private RiskBenefitDto riskBenefit;

    public InvestmentSuggestionResponseDto() {
    }

    public InvestmentSuggestionResponseDto(BigDecimal remainingIncome, InvestmentType investmentType, String investmentTypeName, List<InvestmentOptionDto> investmentOptions, RiskBenefitDto riskBenefit) {
        this.remainingIncome = remainingIncome;
        this.investmentType = investmentType;
        this.investmentTypeName = investmentTypeName;
        this.investmentOptions = investmentOptions;
        this.riskBenefit = riskBenefit;
    }

    public BigDecimal getRemainingIncome() {
        return remainingIncome;
    }

    public void setRemainingIncome(BigDecimal remainingIncome) {
        this.remainingIncome = remainingIncome;
    }

    public InvestmentType getInvestmentType() {
        return investmentType;
    }

    public void setInvestmentType(InvestmentType investmentType) {
        this.investmentType = investmentType;
    }

    public String getInvestmentTypeName() {
        return investmentTypeName;
    }

    public void setInvestmentTypeName(String investmentTypeName) {
        this.investmentTypeName = investmentTypeName;
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
}
