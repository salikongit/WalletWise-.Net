package com.walletwise.api.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "UserFinancialProfiles")
public class FinancialProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer profileId;

    @Column(name = "user_id", insertable = false, updatable = false)
    private Integer userId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(precision = 18, scale = 2)
    private BigDecimal totalIncome;

    @Column(precision = 18, scale = 2)
    private BigDecimal totalExpenses;

    @Column(precision = 18, scale = 2)
    private BigDecimal totalSavings;

    @Column(precision = 18, scale = 2)
    private BigDecimal totalInvestments;

    @Column(precision = 18, scale = 2)
    private BigDecimal totalLoans;

    private LocalDateTime lastUpdated = LocalDateTime.now();

    public FinancialProfile() {
    }

    public FinancialProfile(Integer profileId, Integer userId, User user, BigDecimal totalIncome, BigDecimal totalExpenses, BigDecimal totalSavings, BigDecimal totalInvestments, BigDecimal totalLoans, LocalDateTime lastUpdated) {
        this.profileId = profileId;
        this.userId = userId;
        this.user = user;
        this.totalIncome = totalIncome;
        this.totalExpenses = totalExpenses;
        this.totalSavings = totalSavings;
        this.totalInvestments = totalInvestments;
        this.totalLoans = totalLoans;
        this.lastUpdated = lastUpdated;
    }

    public Integer getProfileId() {
        return profileId;
    }

    public void setProfileId(Integer profileId) {
        this.profileId = profileId;
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

    public BigDecimal getTotalIncome() {
        return totalIncome;
    }

    public void setTotalIncome(BigDecimal totalIncome) {
        this.totalIncome = totalIncome;
    }

    public BigDecimal getTotalExpenses() {
        return totalExpenses;
    }

    public void setTotalExpenses(BigDecimal totalExpenses) {
        this.totalExpenses = totalExpenses;
    }

    public BigDecimal getTotalSavings() {
        return totalSavings;
    }

    public void setTotalSavings(BigDecimal totalSavings) {
        this.totalSavings = totalSavings;
    }

    public BigDecimal getTotalInvestments() {
        return totalInvestments;
    }

    public void setTotalInvestments(BigDecimal totalInvestments) {
        this.totalInvestments = totalInvestments;
    }

    public BigDecimal getTotalLoans() {
        return totalLoans;
    }

    public void setTotalLoans(BigDecimal totalLoans) {
        this.totalLoans = totalLoans;
    }

    public LocalDateTime getLastUpdated() {
        return lastUpdated;
    }

    public void setLastUpdated(LocalDateTime lastUpdated) {
        this.lastUpdated = lastUpdated;
    }
}
