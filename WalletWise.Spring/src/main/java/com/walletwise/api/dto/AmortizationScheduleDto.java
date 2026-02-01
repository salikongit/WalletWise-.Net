package com.walletwise.api.dto;

import java.math.BigDecimal;

public class AmortizationScheduleDto {
    private Integer month;
    private BigDecimal principal;
    private BigDecimal interest;
    private BigDecimal balance;

    public AmortizationScheduleDto() {
    }

    public AmortizationScheduleDto(Integer month, BigDecimal principal, BigDecimal interest, BigDecimal balance) {
        this.month = month;
        this.principal = principal;
        this.interest = interest;
        this.balance = balance;
    }

    public Integer getMonth() {
        return month;
    }

    public void setMonth(Integer month) {
        this.month = month;
    }

    public BigDecimal getPrincipal() {
        return principal;
    }

    public void setPrincipal(BigDecimal principal) {
        this.principal = principal;
    }

    public BigDecimal getInterest() {
        return interest;
    }

    public void setInterest(BigDecimal interest) {
        this.interest = interest;
    }

    public BigDecimal getBalance() {
        return balance;
    }

    public void setBalance(BigDecimal balance) {
        this.balance = balance;
    }
}
