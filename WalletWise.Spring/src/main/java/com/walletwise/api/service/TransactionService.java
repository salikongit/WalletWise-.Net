package com.walletwise.api.service;

import com.walletwise.api.dto.ExpenseDto;
import com.walletwise.api.dto.IncomeDto;
import com.walletwise.api.model.Expense;
import com.walletwise.api.model.FinancialProfile;
import com.walletwise.api.model.Income;
import com.walletwise.api.model.User;
import com.walletwise.api.repository.ExpenseRepository;
import com.walletwise.api.repository.FinancialProfileRepository;
import com.walletwise.api.repository.IncomeRepository;
import com.walletwise.api.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TransactionService {

    @Autowired
    private IncomeRepository incomeRepository;
    @Autowired
    private ExpenseRepository expenseRepository;
    @Autowired
    private FinancialProfileRepository profileRepository;
    @Autowired
    private UserRepository userRepository;

    @Transactional
    public IncomeDto addIncome(Integer userId, IncomeDto incomeDto) {
        User user = userRepository.getReferenceById(userId); 
        Income income = new Income();
        income.setUser(user);
        income.setIncomeSource(incomeDto.getIncomeSource());
        income.setAmount(incomeDto.getAmount());
        income.setIncomeDate(incomeDto.getIncomeDate().atStartOfDay());
        income.setDescription(incomeDto.getDescription());
        income.setCategory(incomeDto.getCategory());
        income.setCreatedAt(LocalDateTime.now());
        
        income = incomeRepository.save(income);
        updateFinancialProfile(userId);
        incomeDto.setIncomeId(income.getIncomeId());
        return incomeDto;
    }

    @Transactional
    public ExpenseDto addExpense(Integer userId, ExpenseDto expenseDto) {
        User user = userRepository.getReferenceById(userId);
        Expense expense = new Expense();
        expense.setUser(user);
        expense.setExpenseName(expenseDto.getExpenseName());
        expense.setAmount(expenseDto.getAmount());
        expense.setExpenseDate(expenseDto.getExpenseDate().atStartOfDay());
        expense.setDescription(expenseDto.getDescription());
        expense.setCategory(expenseDto.getCategory());
        expense.setCreatedAt(LocalDateTime.now());

        expense = expenseRepository.save(expense);
        updateFinancialProfile(userId);
        expenseDto.setExpenseId(expense.getExpenseId());
        return expenseDto;
    }

    @Transactional
    public IncomeDto updateIncome(Integer userId, Integer incomeId, IncomeDto dto) {
        Income income = incomeRepository.findById(incomeId)
                .filter(i -> i.getUser().getUserId().equals(userId))
                .orElseThrow(() -> new RuntimeException("Income not found or access denied"));

        income.setIncomeSource(dto.getIncomeSource());
        income.setAmount(dto.getAmount());
        income.setIncomeDate(dto.getIncomeDate().atStartOfDay());
        income.setDescription(dto.getDescription());
        income.setCategory(dto.getCategory());
        
        incomeRepository.save(income);
        updateFinancialProfile(userId);
        return dto;
    }

    @Transactional
    public void deleteIncome(Integer userId, Integer incomeId) {
        Income income = incomeRepository.findById(incomeId)
                .filter(i -> i.getUser().getUserId().equals(userId))
                .orElseThrow(() -> new RuntimeException("Income not found or access denied"));
        
        incomeRepository.delete(income);
        updateFinancialProfile(userId);
    }

    @Transactional
    public ExpenseDto updateExpense(Integer userId, Integer expenseId, ExpenseDto dto) {
        Expense expense = expenseRepository.findById(expenseId)
                .filter(e -> e.getUser().getUserId().equals(userId))
                .orElseThrow(() -> new RuntimeException("Expense not found or access denied"));

        expense.setExpenseName(dto.getExpenseName());
        expense.setAmount(dto.getAmount());
        expense.setExpenseDate(dto.getExpenseDate().atStartOfDay());
        expense.setDescription(dto.getDescription());
        expense.setCategory(dto.getCategory());

        expenseRepository.save(expense);
        updateFinancialProfile(userId);
        return dto;
    }

    @Transactional
    public void deleteExpense(Integer userId, Integer expenseId) {
        Expense expense = expenseRepository.findById(expenseId)
                .filter(e -> e.getUser().getUserId().equals(userId))
                .orElseThrow(() -> new RuntimeException("Expense not found or access denied"));

        expenseRepository.delete(expense);
        updateFinancialProfile(userId);
    }
    
    public List<IncomeDto> getIncomes(Integer userId, LocalDateTime startDate, LocalDateTime endDate) {
        return incomeRepository.findByUserIdAndDateRange(userId, startDate, endDate).stream()
                .map(i -> {
                    IncomeDto dto = new IncomeDto();
                    dto.setIncomeId(i.getIncomeId());
                    dto.setIncomeSource(i.getIncomeSource());
                    dto.setAmount(i.getAmount());
                    dto.setIncomeDate(i.getIncomeDate().toLocalDate());
                    dto.setDescription(i.getDescription());
                    dto.setCategory(i.getCategory());
                    return dto;
                })
                .collect(Collectors.toList());
    }

    public List<ExpenseDto> getExpenses(Integer userId, LocalDateTime startDate, LocalDateTime endDate) {
        return expenseRepository.findByUserIdAndDateRange(userId, startDate, endDate).stream()
                .map(e -> {
                    ExpenseDto dto = new ExpenseDto();
                    dto.setExpenseId(e.getExpenseId());
                    dto.setExpenseName(e.getExpenseName());
                    dto.setAmount(e.getAmount());
                    dto.setExpenseDate(e.getExpenseDate().toLocalDate());
                    dto.setDescription(e.getDescription());
                    dto.setCategory(e.getCategory());
                    return dto;
                })
                .collect(Collectors.toList());
    }

    @Transactional
    private void updateFinancialProfile(Integer userId) {
        BigDecimal totalIncome = incomeRepository.findByUserId(userId).stream().map(Income::getAmount).reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal totalExpenses = expenseRepository.findByUserId(userId).stream().map(Expense::getAmount).reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal totalSavings = totalIncome.subtract(totalExpenses);

        FinancialProfile profile = profileRepository.findByUserId(userId)
                .orElseGet(() -> {
                    FinancialProfile p = new FinancialProfile();
                    p.setUserId(userId);
                    return p;
                });
        
        profile.setTotalIncome(totalIncome);
        profile.setTotalExpenses(totalExpenses);
        profile.setTotalSavings(totalSavings);
        profile.setLastUpdated(LocalDateTime.now());
        
        profileRepository.save(profile);
    }
}
