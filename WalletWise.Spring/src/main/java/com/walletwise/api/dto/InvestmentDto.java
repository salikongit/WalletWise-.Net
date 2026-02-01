package com.walletwise.api.dto;

import com.walletwise.api.model.InvestmentType;
import java.math.BigDecimal;

public class InvestmentDto {
    private Integer investmentId;
    private String investmentName;
    private InvestmentType investmentType;
    private BigDecimal principalAmount;
    private BigDecimal expectedReturnRate;
    private Integer investmentPeriodYears;

    public InvestmentDto() {
    }

    public InvestmentDto(Integer investmentId, String investmentName, InvestmentType investmentType, BigDecimal principalAmount, BigDecimal expectedReturnRate, Integer investmentPeriodYears) {
        this.investmentId = investmentId;
        this.investmentName = investmentName;
        this.investmentType = investmentType;
        this.principalAmount = principalAmount;
        this.expectedReturnRate = expectedReturnRate;
        this.investmentPeriodYears = investmentPeriodYears;
    }

    public Integer getInvestmentId() {
        return investmentId;
    }

    public void setInvestmentId(Integer investmentId) {
        this.investmentId = investmentId;
    }

    public String getInvestmentName() {
        return investmentName;
    }

    public void setInvestmentName(String investmentName) {
        this.investmentName = investmentName;
    }

    public InvestmentType getInvestmentType() {
        return investmentType;
    }

    public void setInvestmentType(InvestmentType investmentType) {
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
}
