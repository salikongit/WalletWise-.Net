package com.walletwise.api.dto;

import com.walletwise.api.model.InvestmentType;
import java.math.BigDecimal;
import java.io.Serializable;
import java.util.List;

public class DashboardDto implements Serializable {
    private BigDecimal totalIncome;
    private BigDecimal totalExpenses;
    private BigDecimal totalSavings;
    private BigDecimal totalMonthlyEmi;
    private BigDecimal availableForInvestment;
    private BigDecimal totalInvestments;
    private BigDecimal totalLoans;
    private List<RecentIncomeDto> recentIncomes;
    private List<RecentExpenseDto> recentExpenses;
    private List<ActiveLoanDto> activeLoans;
    private List<ActiveInvestmentDto> activeInvestments;

    public DashboardDto() {
    }

    public DashboardDto(BigDecimal totalIncome, BigDecimal totalExpenses, BigDecimal totalSavings, BigDecimal totalMonthlyEmi, BigDecimal availableForInvestment, BigDecimal totalInvestments, BigDecimal totalLoans, List<RecentIncomeDto> recentIncomes, List<RecentExpenseDto> recentExpenses, List<ActiveLoanDto> activeLoans, List<ActiveInvestmentDto> activeInvestments) {
        this.totalIncome = totalIncome;
        this.totalExpenses = totalExpenses;
        this.totalSavings = totalSavings;
        this.totalMonthlyEmi = totalMonthlyEmi;
        this.availableForInvestment = availableForInvestment;
        this.totalInvestments = totalInvestments;
        this.totalLoans = totalLoans;
        this.recentIncomes = recentIncomes;
        this.recentExpenses = recentExpenses;
        this.activeLoans = activeLoans;
        this.activeInvestments = activeInvestments;
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

    public BigDecimal getTotalMonthlyEmi() {
        return totalMonthlyEmi;
    }

    public void setTotalMonthlyEmi(BigDecimal totalMonthlyEmi) {
        this.totalMonthlyEmi = totalMonthlyEmi;
    }

    public BigDecimal getAvailableForInvestment() {
        return availableForInvestment;
    }

    public void setAvailableForInvestment(BigDecimal availableForInvestment) {
        this.availableForInvestment = availableForInvestment;
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

    public List<RecentIncomeDto> getRecentIncomes() {
        return recentIncomes;
    }

    public void setRecentIncomes(List<RecentIncomeDto> recentIncomes) {
        this.recentIncomes = recentIncomes;
    }

    public List<RecentExpenseDto> getRecentExpenses() {
        return recentExpenses;
    }

    public void setRecentExpenses(List<RecentExpenseDto> recentExpenses) {
        this.recentExpenses = recentExpenses;
    }

    public List<ActiveLoanDto> getActiveLoans() {
        return activeLoans;
    }

    public void setActiveLoans(List<ActiveLoanDto> activeLoans) {
        this.activeLoans = activeLoans;
    }

    public List<ActiveInvestmentDto> getActiveInvestments() {
        return activeInvestments;
    }

    public void setActiveInvestments(List<ActiveInvestmentDto> activeInvestments) {
        this.activeInvestments = activeInvestments;
    }
}
