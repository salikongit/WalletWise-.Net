package com.walletwise.api.dto;

import java.math.BigDecimal;

public class InvestmentSuggestionDto {
    private BigDecimal remainingIncome;
    private BigDecimal suggestedSip;
    private BigDecimal suggestedLumpsum;
    private String investmentProfile;
    private String recommendation;

    public InvestmentSuggestionDto() {
    }

    public InvestmentSuggestionDto(BigDecimal remainingIncome, BigDecimal suggestedSip, BigDecimal suggestedLumpsum, String investmentProfile, String recommendation) {
        this.remainingIncome = remainingIncome;
        this.suggestedSip = suggestedSip;
        this.suggestedLumpsum = suggestedLumpsum;
        this.investmentProfile = investmentProfile;
        this.recommendation = recommendation;
    }

    public BigDecimal getRemainingIncome() {
        return remainingIncome;
    }

    public void setRemainingIncome(BigDecimal remainingIncome) {
        this.remainingIncome = remainingIncome;
    }

    public BigDecimal getSuggestedSip() {
        return suggestedSip;
    }

    public void setSuggestedSip(BigDecimal suggestedSip) {
        this.suggestedSip = suggestedSip;
    }

    public BigDecimal getSuggestedLumpsum() {
        return suggestedLumpsum;
    }

    public void setSuggestedLumpsum(BigDecimal suggestedLumpsum) {
        this.suggestedLumpsum = suggestedLumpsum;
    }

    public String getInvestmentProfile() {
        return investmentProfile;
    }

    public void setInvestmentProfile(String investmentProfile) {
        this.investmentProfile = investmentProfile;
    }

    public String getRecommendation() {
        return recommendation;
    }

    public void setRecommendation(String recommendation) {
        this.recommendation = recommendation;
    }
}
