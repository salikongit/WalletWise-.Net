package com.walletwise.api.service;

import com.walletwise.api.dto.*;
import com.walletwise.api.model.*;
import com.walletwise.api.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;

@Service
public class OnboardingService {

    @Autowired
    private UserOnboardingStatusRepository onboardingStatusRepository;
    @Autowired
    private IncomeRepository incomeRepository;
    @Autowired
    private ExpenseRepository expenseRepository;
    @Autowired
    private LoanRepository loanRepository;
    @Autowired
    private FinancialCalculationService calculationService;
    @Autowired
    private StockService stockService;
    @Autowired
    private AmortizationScheduleRepository amortizationScheduleRepository;
    @Autowired
    private UserRepository userRepository;

    @Transactional
    public OnboardingResponseDto completeOnboarding(Integer userId, OnboardingRequestDto request) {
        if (!request.isRiskAccepted()) {
            throw new RuntimeException("Please accept risks to proceed.");
        }

        User user = userRepository.getReferenceById(userId);

        // Step 1: Salary
        BigDecimal monthlySalary = request.getSalary();
        if ("yearly".equalsIgnoreCase(request.getSalaryFrequency())) {
            monthlySalary = monthlySalary.divide(BigDecimal.valueOf(12), RoundingMode.HALF_UP);
        }

        Income salaryIncome = new Income();
        salaryIncome.setUser(user);
        salaryIncome.setIncomeSource("Salary");
        salaryIncome.setAmount(monthlySalary);
        salaryIncome.setCategory("Salary");
        salaryIncome.setDescription("Monthly salary");
        salaryIncome.setIncomeDate(LocalDateTime.now());
        salaryIncome.setCreatedAt(LocalDateTime.now());
        incomeRepository.save(salaryIncome);

        // Step 2: Expenses
        BigDecimal totalMonthlyExpenses = BigDecimal.ZERO;
        if (request.getMonthlyExpenses() != null) {
            for (ExpenseDto e : request.getMonthlyExpenses()) {
                Expense expense = new Expense();
                expense.setUser(user);
                expense.setExpenseName(e.getExpenseName());
                expense.setAmount(e.getAmount());
                expense.setCategory(e.getCategory());
                expense.setDescription(e.getDescription());
                expense.setExpenseDate(LocalDateTime.now());
                expense.setCreatedAt(LocalDateTime.now());
                expenseRepository.save(expense);
                totalMonthlyExpenses = totalMonthlyExpenses.add(e.getAmount());
            }
        }

        // Step 3: Loans
        BigDecimal totalEmi = BigDecimal.ZERO;
        if (request.getLoans() != null) {
            for (LoanDto l : request.getLoans()) {
                EmiCalculationDto emiDto = new EmiCalculationDto();
                emiDto.setPrincipalAmount(l.getPrincipalAmount());
                emiDto.setInterestRate(l.getInterestRate());
                emiDto.setTenureMonths(l.getTenureMonths());
                
                EmiResponseDto emiRes = calculationService.calculateEmi(emiDto);
                
                totalEmi = totalEmi.add(emiRes.getEmiAmount());

                Loan loan = new Loan();
                loan.setUser(user);
                loan.setLoanName(l.getLoanName());
                loan.setPrincipalAmount(l.getPrincipalAmount());
                loan.setInterestRate(l.getInterestRate());
                loan.setTenureMonths(l.getTenureMonths());
                loan.setEmiAmount(emiRes.getEmiAmount());
                loan.setCreatedAt(LocalDateTime.now());
                loan = loanRepository.save(loan);

                // Save Schedule
                Loan finalLoan = loan;
                emiRes.getAmortizationSchedule().forEach(s -> {
                    AmortizationSchedule schedule = new AmortizationSchedule();
                    schedule.setLoan(finalLoan);
                    schedule.setMonth(s.getMonth());
                    schedule.setPrincipal(s.getPrincipal());
                    schedule.setInterest(s.getInterest());
                    schedule.setBalance(s.getBalance());
                    amortizationScheduleRepository.save(schedule);
                });
            }
        }

        // Step 4: Remaining Income
        BigDecimal remainingIncome = monthlySalary.subtract(totalMonthlyExpenses).subtract(totalEmi);

        // Step 5: Suggestions
        var options = stockService.getInvestmentSuggestions(request.getInvestmentType(), remainingIncome);
        var riskBenefit = stockService.getRiskBenefit(request.getInvestmentType());

        // Step 6: Update Status
        UserOnboardingStatus status = onboardingStatusRepository.findByUserId(userId)
                .orElseGet(() -> {
                    UserOnboardingStatus s = new UserOnboardingStatus();
                    s.setUser(user);
                    return s;
                });
        
        status.setCompletedAt(LocalDateTime.now());
        status.setSalaryEntered(true);
        status.setExpensesEntered(true);
        status.setLoansEntered(request.getLoans() != null && !request.getLoans().isEmpty());
        status.setSelectedInvestmentType(request.getInvestmentType());
        onboardingStatusRepository.save(status);

        // Step 7: Response
        BigDecimal suggestedSip = request.getInvestmentType() == InvestmentType.SIP 
                ? remainingIncome.multiply(BigDecimal.valueOf(0.7)).setScale(2, RoundingMode.HALF_UP) 
                : null;
        BigDecimal suggestedLumpsum = request.getInvestmentType() == InvestmentType.Lumpsum 
                ? remainingIncome.multiply(BigDecimal.valueOf(0.2)).setScale(2, RoundingMode.HALF_UP) 
                : null;

        InvestmentSuggestionDto suggestionDto = new InvestmentSuggestionDto();
        suggestionDto.setRemainingIncome(remainingIncome);
        suggestionDto.setSuggestedSip(suggestedSip);
        suggestionDto.setSuggestedLumpsum(suggestedLumpsum);
        suggestionDto.setInvestmentProfile(riskBenefit.getRiskLevel());
        suggestionDto.setRecommendation("Based on ₹" + remainingIncome + ", " + request.getInvestmentType() + " is recommended.");
        
        OnboardingResponseDto response = new OnboardingResponseDto();
        response.setSuccess(true);
        response.setMessage("Onboarding Completed!");
        response.setRemainingIncome(remainingIncome);
        response.setInvestmentSuggestion(suggestionDto);
        response.setInvestmentOptions(options);
        response.setRiskBenefit(riskBenefit);
        response.setOnboardingComplete(true);
        return response;
    }
}
