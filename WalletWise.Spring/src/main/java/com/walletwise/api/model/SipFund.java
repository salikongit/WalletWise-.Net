package com.walletwise.api.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "SipFunds")
public class SipFund {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer sipId;

    @Column(nullable = false)
    private String fundCode;

    @Column(nullable = false)
    private String fundName;

    private String category;

    @Column(precision = 18, scale = 2)
    private BigDecimal minMonthlyAmount;

    @Column(precision = 18, scale = 2)
    private BigDecimal maxMonthlyAmount;

    @Column(precision = 5, scale = 2)
    private BigDecimal expectedReturn;

    private Integer lockInYears;
    private String riskLevel;
    
    private boolean isActive = true;

    public SipFund() {
    }

    public SipFund(Integer sipId, String fundCode, String fundName, String category, BigDecimal minMonthlyAmount, BigDecimal maxMonthlyAmount, BigDecimal expectedReturn, Integer lockInYears, String riskLevel, boolean isActive) {
        this.sipId = sipId;
        this.fundCode = fundCode;
        this.fundName = fundName;
        this.category = category;
        this.minMonthlyAmount = minMonthlyAmount;
        this.maxMonthlyAmount = maxMonthlyAmount;
        this.expectedReturn = expectedReturn;
        this.lockInYears = lockInYears;
        this.riskLevel = riskLevel;
        this.isActive = isActive;
    }

    public Integer getSipId() {
        return sipId;
    }

    public void setSipId(Integer sipId) {
        this.sipId = sipId;
    }

    public String getFundCode() {
        return fundCode;
    }

    public void setFundCode(String fundCode) {
        this.fundCode = fundCode;
    }

    public String getFundName() {
        return fundName;
    }

    public void setFundName(String fundName) {
        this.fundName = fundName;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public BigDecimal getMinMonthlyAmount() {
        return minMonthlyAmount;
    }

    public void setMinMonthlyAmount(BigDecimal minMonthlyAmount) {
        this.minMonthlyAmount = minMonthlyAmount;
    }

    public BigDecimal getMaxMonthlyAmount() {
        return maxMonthlyAmount;
    }

    public void setMaxMonthlyAmount(BigDecimal maxMonthlyAmount) {
        this.maxMonthlyAmount = maxMonthlyAmount;
    }

    public BigDecimal getExpectedReturn() {
        return expectedReturn;
    }

    public void setExpectedReturn(BigDecimal expectedReturn) {
        this.expectedReturn = expectedReturn;
    }

    public Integer getLockInYears() {
        return lockInYears;
    }

    public void setLockInYears(Integer lockInYears) {
        this.lockInYears = lockInYears;
    }

    public String getRiskLevel() {
        return riskLevel;
    }

    public void setRiskLevel(String riskLevel) {
        this.riskLevel = riskLevel;
    }

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean isActive) {
        this.isActive = isActive;
    }
}
