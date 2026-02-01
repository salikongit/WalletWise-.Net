package com.walletwise.api.service;

import com.walletwise.api.dto.*;
import com.walletwise.api.model.Income;
import com.walletwise.api.model.Expense;
import com.walletwise.api.model.Loan;
import com.walletwise.api.model.Investment;
import com.walletwise.api.repository.ExpenseRepository;
import com.walletwise.api.repository.IncomeRepository;
import com.walletwise.api.repository.InvestmentRepository;
import com.walletwise.api.repository.LoanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired
    private IncomeRepository incomeRepository;
    @Autowired
    private ExpenseRepository expenseRepository;
    @Autowired
    private LoanRepository loanRepository;
    @Autowired
    private InvestmentRepository investmentRepository;
    @Autowired
    private com.walletwise.api.repository.FinancialProfileRepository financialProfileRepository;

    public DashboardDto getDashboard(Integer userId) {
        List<Income> incomes = incomeRepository.findByUserId(userId);
        List<Expense> expenses = expenseRepository.findByUserId(userId);
        List<Loan> loans = loanRepository.findByUserId(userId);
        List<Investment> investments = investmentRepository.findByUserId(userId);

        BigDecimal totalIncome = incomes.stream().map(Income::getAmount).reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal totalExpenses = expenses.stream().map(Expense::getAmount).reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal totalMonthlyEmi = loans.stream()
                .map(l -> l.getEmiAmount() != null ? l.getEmiAmount() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        BigDecimal totalSavings = totalIncome.subtract(totalExpenses).subtract(totalMonthlyEmi);
        BigDecimal totalInvestments = investments.stream().map(Investment::getPrincipalAmount).reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal totalLoans = loans.stream().map(Loan::getPrincipalAmount).reduce(BigDecimal.ZERO, BigDecimal::add);

        DashboardDto dashboardDto = new DashboardDto();
        dashboardDto.setTotalIncome(totalIncome);
        dashboardDto.setTotalExpenses(totalExpenses);
        dashboardDto.setTotalSavings(totalSavings);
        dashboardDto.setTotalMonthlyEmi(totalMonthlyEmi);
        dashboardDto.setAvailableForInvestment(totalSavings.max(BigDecimal.ZERO));
        dashboardDto.setTotalInvestments(totalInvestments);
        dashboardDto.setTotalLoans(totalLoans);

        dashboardDto.setRecentIncomes(incomes.stream().limit(5).map(i -> {
            RecentIncomeDto dto = new RecentIncomeDto();
            dto.setIncomeId(i.getIncomeId());
            dto.setIncomeSource(i.getIncomeSource());
            dto.setAmount(i.getAmount());
            dto.setIncomeDate(i.getIncomeDate());
            dto.setCategory(i.getCategory());
            return dto;
        }).collect(Collectors.toList()));

        dashboardDto.setRecentExpenses(expenses.stream().limit(5).map(e -> {
            RecentExpenseDto dto = new RecentExpenseDto();
            dto.setExpenseId(e.getExpenseId());
            dto.setExpenseName(e.getExpenseName());
            dto.setAmount(e.getAmount());
            dto.setExpenseDate(e.getExpenseDate());
            dto.setCategory(e.getCategory());
            return dto;
        }).collect(Collectors.toList()));

        dashboardDto.setActiveLoans(loans.stream().map(l -> {
            ActiveLoanDto dto = new ActiveLoanDto();
            dto.setLoanId(l.getLoanId());
            dto.setLoanName(l.getLoanName());
            dto.setPrincipalAmount(l.getPrincipalAmount());
            dto.setEmiAmount(l.getEmiAmount() != null ? l.getEmiAmount() : BigDecimal.ZERO);
            dto.setTenureMonths(l.getTenureMonths());
            return dto;
        }).collect(Collectors.toList()));

        dashboardDto.setActiveInvestments(investments.stream().map(i -> {
            ActiveInvestmentDto dto = new ActiveInvestmentDto();
            dto.setInvestmentId(i.getInvestmentId());
            dto.setInvestmentName(i.getInvestmentName());
            dto.setInvestmentType(i.getInvestmentType());
            dto.setPrincipalAmount(i.getPrincipalAmount());
            dto.setExpectedFutureValue(i.getExpectedFutureValue());
            return dto;
        }).collect(Collectors.toList()));

        return dashboardDto;
    }
    @org.springframework.transaction.annotation.Transactional
    public void resetUserData(Integer userId) {
        // Loans (Amortization cascades if configured, else manual)
        // Checking Loan entity shows cascade ALL, so amortization should be deleted.
        // But to be safe/explicit or if lazy loading issues:
        List<Loan> loans = loanRepository.findByUserId(userId);
        loanRepository.deleteAll(loans);

        // Incomes
        incomeRepository.deleteAll(incomeRepository.findByUserId(userId));

        // Expenses
        expenseRepository.deleteAll(expenseRepository.findByUserId(userId));

        // Investments
        investmentRepository.deleteAll(investmentRepository.findByUserId(userId));

        // Financial Profile
        financialProfileRepository.findByUserId(userId).ifPresent(financialProfileRepository::delete);
    }
}
