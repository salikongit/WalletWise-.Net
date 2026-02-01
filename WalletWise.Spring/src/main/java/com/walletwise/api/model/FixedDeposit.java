package com.walletwise.api.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "FixedDeposits")
public class FixedDeposit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer fdId;

    @Column(nullable = false)
    private String bankName;

    private Integer tenureYears;

    @Column(precision = 18, scale = 2)
    private BigDecimal minInvestment;

    @Column(precision = 18, scale = 2)
    private BigDecimal maxInvestment;

    @Column(precision = 5, scale = 2)
    private BigDecimal interestRate;

    private boolean isActive = true;

    public FixedDeposit() {
    }

    public FixedDeposit(Integer fdId, String bankName, Integer tenureYears, BigDecimal minInvestment, BigDecimal maxInvestment, BigDecimal interestRate, boolean isActive) {
        this.fdId = fdId;
        this.bankName = bankName;
        this.tenureYears = tenureYears;
        this.minInvestment = minInvestment;
        this.maxInvestment = maxInvestment;
        this.interestRate = interestRate;
        this.isActive = isActive;
    }

    public Integer getFdId() {
        return fdId;
    }

    public void setFdId(Integer fdId) {
        this.fdId = fdId;
    }

    public String getBankName() {
        return bankName;
    }

    public void setBankName(String bankName) {
        this.bankName = bankName;
    }

    public Integer getTenureYears() {
        return tenureYears;
    }

    public void setTenureYears(Integer tenureYears) {
        this.tenureYears = tenureYears;
    }

    public BigDecimal getMinInvestment() {
        return minInvestment;
    }

    public void setMinInvestment(BigDecimal minInvestment) {
        this.minInvestment = minInvestment;
    }

    public BigDecimal getMaxInvestment() {
        return maxInvestment;
    }

    public void setMaxInvestment(BigDecimal maxInvestment) {
        this.maxInvestment = maxInvestment;
    }

    public BigDecimal getInterestRate() {
        return interestRate;
    }

    public void setInterestRate(BigDecimal interestRate) {
        this.interestRate = interestRate;
    }

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean isActive) {
        this.isActive = isActive;
    }
}
