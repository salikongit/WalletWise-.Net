package com.walletwise.api.dto;

import com.walletwise.api.model.InvestmentType;
import java.math.BigDecimal;

public class InvestmentCalculationDto {
    private BigDecimal principalAmount;
    private BigDecimal expectedReturnRate;
    private Integer investmentPeriodYears;
    private InvestmentType investmentType;

    public InvestmentCalculationDto() {
    }

    public InvestmentCalculationDto(BigDecimal principalAmount, BigDecimal expectedReturnRate, Integer investmentPeriodYears, InvestmentType investmentType) {
        this.principalAmount = principalAmount;
        this.expectedReturnRate = expectedReturnRate;
        this.investmentPeriodYears = investmentPeriodYears;
        this.investmentType = investmentType;
    }

    public BigDecimal getPrincipalAmount() {
        return principalAmount;
    }

    public void setPrincipalAmount(BigDecimal principalAmount) {
        this.principalAmount = principalAmount;
    }

    public BigDecimal getExpectedReturnRate() {
        return expectedReturnRate;
    }

    public void setExpectedReturnRate(BigDecimal expectedReturnRate) {
        this.expectedReturnRate = expectedReturnRate;
    }

    public Integer getInvestmentPeriodYears() {
        return investmentPeriodYears;
    }

    public void setInvestmentPeriodYears(Integer investmentPeriodYears) {
        this.investmentPeriodYears = investmentPeriodYears;
    }

    public InvestmentType getInvestmentType() {
        return investmentType;
    }

    public void setInvestmentType(InvestmentType investmentType) {
        this.investmentType = investmentType;
    }
}
