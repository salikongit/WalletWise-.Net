package com.walletwise.api.dto;

import java.math.BigDecimal;

public class EmiCalculationDto {
    private BigDecimal principalAmount;
    private BigDecimal interestRate;
    private Integer tenureMonths;

    public EmiCalculationDto() {
    }

    public EmiCalculationDto(BigDecimal principalAmount, BigDecimal interestRate, Integer tenureMonths) {
        this.principalAmount = principalAmount;
        this.interestRate = interestRate;
        this.tenureMonths = tenureMonths;
    }

    public BigDecimal getPrincipalAmount() {
        return principalAmount;
    }

    public void setPrincipalAmount(BigDecimal principalAmount) {
        this.principalAmount = principalAmount;
    }

    public BigDecimal getInterestRate() {
        return interestRate;
    }

    public void setInterestRate(BigDecimal interestRate) {
        this.interestRate = interestRate;
    }

    public Integer getTenureMonths() {
        return tenureMonths;
    }

    public void setTenureMonths(Integer tenureMonths) {
        this.tenureMonths = tenureMonths;
    }
}
