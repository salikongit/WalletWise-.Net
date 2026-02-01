package com.walletwise.api.dto;

import com.walletwise.api.model.InvestmentType;
import java.math.BigDecimal;
import java.util.List;

public class OnboardingRequestDto {
    private BigDecimal salary;
    private String salaryFrequency;
    private List<ExpenseDto> monthlyExpenses;
    private List<LoanDto> loans;
    private InvestmentType investmentType;
    private boolean riskAccepted;

    public OnboardingRequestDto() {
    }

    public OnboardingRequestDto(BigDecimal salary, String salaryFrequency, List<ExpenseDto> monthlyExpenses, List<LoanDto> loans, InvestmentType investmentType, boolean riskAccepted) {
        this.salary = salary;
        this.salaryFrequency = salaryFrequency;
        this.monthlyExpenses = monthlyExpenses;
        this.loans = loans;
        this.investmentType = investmentType;
        this.riskAccepted = riskAccepted;
    }

    public BigDecimal getSalary() {
        return salary;
    }

    public void setSalary(BigDecimal salary) {
        this.salary = salary;
    }

    public String getSalaryFrequency() {
        return salaryFrequency;
    }

    public void setSalaryFrequency(String salaryFrequency) {
        this.salaryFrequency = salaryFrequency;
    }

    public List<ExpenseDto> getMonthlyExpenses() {
        return monthlyExpenses;
    }

    public void setMonthlyExpenses(List<ExpenseDto> monthlyExpenses) {
        this.monthlyExpenses = monthlyExpenses;
    }

    public List<LoanDto> getLoans() {
        return loans;
    }

    public void setLoans(List<LoanDto> loans) {
        this.loans = loans;
    }

    public InvestmentType getInvestmentType() {
        return investmentType;
    }

    public void setInvestmentType(InvestmentType investmentType) {
        this.investmentType = investmentType;
    }

    public boolean isRiskAccepted() {
        return riskAccepted;
    }

    public void setRiskAccepted(boolean riskAccepted) {
        this.riskAccepted = riskAccepted;
    }
}
