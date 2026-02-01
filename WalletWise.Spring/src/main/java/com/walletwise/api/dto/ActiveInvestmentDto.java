package com.walletwise.api.dto;

import com.walletwise.api.model.InvestmentType;
import java.math.BigDecimal;

public class ActiveInvestmentDto {
    private Integer investmentId;
    private String investmentName;
    private InvestmentType investmentType;
    private BigDecimal principalAmount;
    private BigDecimal expectedFutureValue;

    public ActiveInvestmentDto() {
    }

    public ActiveInvestmentDto(Integer investmentId, String investmentName, InvestmentType investmentType, BigDecimal principalAmount, BigDecimal expectedFutureValue) {
        this.investmentId = investmentId;
        this.investmentName = investmentName;
        this.investmentType = investmentType;
        this.principalAmount = principalAmount;
        this.expectedFutureValue = expectedFutureValue;
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

    public BigDecimal getExpectedFutureValue() {
        return expectedFutureValue;
    }

    public void setExpectedFutureValue(BigDecimal expectedFutureValue) {
        this.expectedFutureValue = expectedFutureValue;
    }
}
