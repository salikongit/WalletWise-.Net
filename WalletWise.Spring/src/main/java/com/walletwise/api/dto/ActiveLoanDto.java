package com.walletwise.api.dto;

import java.math.BigDecimal;

public class ActiveLoanDto {
    private Integer loanId;
    private String loanName;
    private BigDecimal principalAmount;
    private BigDecimal emiAmount;
    private Integer tenureMonths;

    public ActiveLoanDto() {
    }

    public ActiveLoanDto(Integer loanId, String loanName, BigDecimal principalAmount, BigDecimal emiAmount, Integer tenureMonths) {
        this.loanId = loanId;
        this.loanName = loanName;
        this.principalAmount = principalAmount;
        this.emiAmount = emiAmount;
        this.tenureMonths = tenureMonths;
    }

    public Integer getLoanId() {
        return loanId;
    }

    public void setLoanId(Integer loanId) {
        this.loanId = loanId;
    }

    public String getLoanName() {
        return loanName;
    }

    public void setLoanName(String loanName) {
        this.loanName = loanName;
    }

    public BigDecimal getPrincipalAmount() {
        return principalAmount;
    }

    public void setPrincipalAmount(BigDecimal principalAmount) {
        this.principalAmount = principalAmount;
    }

    public BigDecimal getEmiAmount() {
        return emiAmount;
    }

    public void setEmiAmount(BigDecimal emiAmount) {
        this.emiAmount = emiAmount;
    }

    public Integer getTenureMonths() {
        return tenureMonths;
    }

    public void setTenureMonths(Integer tenureMonths) {
        this.tenureMonths = tenureMonths;
    }
}
