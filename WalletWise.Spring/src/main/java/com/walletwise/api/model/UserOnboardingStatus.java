package com.walletwise.api.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "UserOnboardingStatuses")
public class UserOnboardingStatus {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer statusId;

    @Column(name = "user_id", insertable = false, updatable = false)
    private Integer userId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    private boolean salaryEntered;
    private boolean loansEntered;
    private boolean expensesEntered;

    @Enumerated(EnumType.ORDINAL)
    private InvestmentType selectedInvestmentType;

    private LocalDateTime completedAt;

    public UserOnboardingStatus() {
    }

    public UserOnboardingStatus(Integer statusId, Integer userId, User user, boolean salaryEntered, boolean loansEntered, boolean expensesEntered, InvestmentType selectedInvestmentType, LocalDateTime completedAt) {
        this.statusId = statusId;
        this.userId = userId;
        this.user = user;
        this.salaryEntered = salaryEntered;
        this.loansEntered = loansEntered;
        this.expensesEntered = expensesEntered;
        this.selectedInvestmentType = selectedInvestmentType;
        this.completedAt = completedAt;
    }

    public Integer getStatusId() {
        return statusId;
    }

    public void setStatusId(Integer statusId) {
        this.statusId = statusId;
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

    public boolean isSalaryEntered() {
        return salaryEntered;
    }

    public void setSalaryEntered(boolean salaryEntered) {
        this.salaryEntered = salaryEntered;
    }

    public boolean isLoansEntered() {
        return loansEntered;
    }

    public void setLoansEntered(boolean loansEntered) {
        this.loansEntered = loansEntered;
    }

    public boolean isExpensesEntered() {
        return expensesEntered;
    }

    public void setExpensesEntered(boolean expensesEntered) {
        this.expensesEntered = expensesEntered;
    }

    public InvestmentType getSelectedInvestmentType() {
        return selectedInvestmentType;
    }

    public void setSelectedInvestmentType(InvestmentType selectedInvestmentType) {
        this.selectedInvestmentType = selectedInvestmentType;
    }

    public LocalDateTime getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(LocalDateTime completedAt) {
        this.completedAt = completedAt;
    }

    public boolean isOnboardingComplete() {
        return completedAt != null;
    }
}
