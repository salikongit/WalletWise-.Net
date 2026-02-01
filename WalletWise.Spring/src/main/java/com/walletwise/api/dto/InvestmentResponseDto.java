package com.walletwise.api.dto;

import com.walletwise.api.model.InvestmentType;
import java.math.BigDecimal;

public class InvestmentResponseDto {
    private BigDecimal futureValue;
    private BigDecimal totalInvestment;
    private BigDecimal totalReturns;
    private InvestmentType investmentType;

    public InvestmentResponseDto() {
    }

    public InvestmentResponseDto(BigDecimal futureValue, BigDecimal totalInvestment, BigDecimal totalReturns, InvestmentType investmentType) {
        this.futureValue = futureValue;
        this.totalInvestment = totalInvestment;
        this.totalReturns = totalReturns;
        this.investmentType = investmentType;
    }

    public BigDecimal getFutureValue() {
        return futureValue;
    }

    public void setFutureValue(BigDecimal futureValue) {
        this.futureValue = futureValue;
    }

    public BigDecimal getTotalInvestment() {
        return totalInvestment;
    }

    public void setTotalInvestment(BigDecimal totalInvestment) {
        this.totalInvestment = totalInvestment;
    }

    public BigDecimal getTotalReturns() {
        return totalReturns;
    }

    public void setTotalReturns(BigDecimal totalReturns) {
        this.totalReturns = totalReturns;
    }

    public InvestmentType getInvestmentType() {
        return investmentType;
    }

    public void setInvestmentType(InvestmentType investmentType) {
        this.investmentType = investmentType;
    }
}
