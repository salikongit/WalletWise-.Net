package com.walletwise.api.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "Investments")
public class Investment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer investmentId;

    @Column(name = "user_id", insertable = false, updatable = false)
    private Integer userId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(nullable = false, length = 200)
    private String investmentName;

    @Enumerated(EnumType.ORDINAL)
    @Column(nullable = false)
    private InvestmentType investmentType;

    @Column(nullable = false, precision = 18, scale = 2)
    private BigDecimal principalAmount;

    @Column(nullable = false, precision = 5, scale = 2)
    private BigDecimal expectedReturnRate;

    @Column(nullable = false)
    private Integer investmentPeriodYears;

    @Column(precision = 18, scale = 2)
    private BigDecimal expectedFutureValue;

    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime updatedAt;

    public Investment() {
    }

    public Investment(Integer investmentId, Integer userId, User user, String investmentName, InvestmentType investmentType, BigDecimal principalAmount, BigDecimal expectedReturnRate, Integer investmentPeriodYears, BigDecimal expectedFutureValue, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.investmentId = investmentId;
        this.userId = userId;
        this.user = user;
        this.investmentName = investmentName;
        this.investmentType = investmentType;
        this.principalAmount = principalAmount;
        this.expectedReturnRate = expectedReturnRate;
        this.investmentPeriodYears = investmentPeriodYears;
        this.expectedFutureValue = expectedFutureValue;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Integer getInvestmentId() {
        return investmentId;
    }

    public void setInvestmentId(Integer investmentId) {
        this.investmentId = investmentId;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
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

    public BigDecimal getExpectedFutureValue() {
        return expectedFutureValue;
    }

    public void setExpectedFutureValue(BigDecimal expectedFutureValue) {
        this.expectedFutureValue = expectedFutureValue;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
