using WalletWise.API.DTOs;
using WalletWise.API.Models;
using WalletWise.API.Repositories;

namespace WalletWise.API.Services
{
    public class OnboardingService : IOnboardingService
    {
        private readonly IUserOnboardingStatusRepository _onboardingStatusRepository;
        private readonly ILoanRepository _loanRepository;
        private readonly IExpenseRepository _expenseRepository;
        private readonly IIncomeRepository _incomeRepository;
        private readonly IFinancialCalculationService _calculationService;
        private readonly IStockService _stockService;
        private readonly IAmortizationScheduleRepository _amortizationScheduleRepository;

        public OnboardingService(
            IUserOnboardingStatusRepository onboardingStatusRepository,
            ILoanRepository loanRepository,
            IExpenseRepository expenseRepository,
            IIncomeRepository incomeRepository,
            IFinancialCalculationService calculationService,
            IStockService stockService,
            IAmortizationScheduleRepository amortizationScheduleRepository)
        {
            _onboardingStatusRepository = onboardingStatusRepository;
            _loanRepository = loanRepository;
            _expenseRepository = expenseRepository;
            _incomeRepository = incomeRepository;
            _calculationService = calculationService;
            _stockService = stockService;
            _amortizationScheduleRepository = amortizationScheduleRepository;
        }
        public async Task<OnboardingResponseDto> CompleteOnboardingAsync(int userId, OnboardingRequestDto request)
        {
            decimal monthlySalary = request.SalaryFrequency.ToLower() == "yearly"
                ? request.Salary / 12
                : request.Salary;

            // STEP 1: Salary
            var salaryIncome = new Income
            {
                UserId = userId,
                IncomeSource = "Salary",
                Amount = monthlySalary,
                Category = "Salary",
                Description = "Monthly salary",
                CreatedAt = DateTime.UtcNow
            };
            await _incomeRepository.CreateAsync(salaryIncome);

            // STEP 2: Expenses
            decimal totalMonthlyExpenses = 0;
            if (request.MonthlyExpenses != null)
            {
                foreach (var e in request.MonthlyExpenses)
                {
                    await _expenseRepository.CreateAsync(new Expense
                    {
                        UserId = userId,
                        ExpenseName = e.ExpenseName,
                        Amount = e.Amount,
                        Category = e.Category,
                        Description = e.Description,
                        CreatedAt = DateTime.UtcNow
                    });
                    totalMonthlyExpenses += e.Amount;
                }
            }

            // STEP 3: Loans + EMI + Schedule
            decimal totalEmi = 0;
            if (request.Loans != null)
            {
                foreach (var loanDto in request.Loans)
                {
                    var emi = _calculationService.CalculateEmi(new EmiCalculationDto
                    {
                        PrincipalAmount = loanDto.PrincipalAmount,
                        InterestRate = loanDto.InterestRate,
                        TenureMonths = loanDto.TenureMonths
                    });

                    totalEmi += emi.EmiAmount;

                    var loan = await _loanRepository.CreateAsync(new Loan
                    {
                        UserId = userId,
                        LoanName = loanDto.LoanName,
                        PrincipalAmount = loanDto.PrincipalAmount,
                        InterestRate = loanDto.InterestRate,
                        TenureMonths = loanDto.TenureMonths,
                        EmiAmount = emi.EmiAmount,
                        CreatedAt = DateTime.UtcNow
                    });

                    await _amortizationScheduleRepository.CreateBatchAsync(
                        emi.AmortizationSchedule.Select(s => new AmortizationSchedule
                        {
                            LoanId = loan.LoanId,
                            Month = s.Month,
                            Principal = s.Principal,
                            Interest = s.Interest,
                            Balance = s.Balance
                        }).ToList()
                    );
                }
            }

            // STEP 4: Remaining Income
            decimal remainingIncome = monthlySalary - totalMonthlyExpenses - totalEmi;

            if (!request.RiskAccepted)
                throw new InvalidOperationException("Please accept risks to proceed.");

            // STEP 5: Investment suggestions
            var investmentOptions = await _stockService.GetInvestmentSuggestionsAsync(request.InvestmentType, remainingIncome);
            var riskBenefit = await _stockService.GetRiskBenefitAsync(request.InvestmentType);

            // STEP 6: Update onboarding status (Option A structure)
            // STEP 6: Update onboarding status (refactored – no redundancy)
            var status = await _onboardingStatusRepository.GetByUserIdAsync(userId)
                       ?? new UserOnboardingStatus { UserId = userId };

            status.CompletedAt = DateTime.UtcNow;


            if (status.StatusId == 0)
                await _onboardingStatusRepository.CreateAsync(status);
            else
                await _onboardingStatusRepository.UpdateAsync(status);


            // STEP 7: Return Response
            return new OnboardingResponseDto
            {
                Success = true,
                Message = "Onboarding Completed!",
                RemainingIncome = remainingIncome,
                InvestmentSuggestion = new InvestmentSuggestionDto
                {
                    RemainingIncome = remainingIncome,

                    SuggestedSip = request.InvestmentType == InvestmentType.SIP
                        ? Math.Round(remainingIncome * 0.7m, 2)
                        : (decimal?)null,

                                    SuggestedLumpsum = request.InvestmentType == InvestmentType.Lumpsum
                        ? Math.Round(remainingIncome * 0.2m, 2)
                        : (decimal?)null,

                    InvestmentProfile = riskBenefit.RiskLevel,

                    Recommendation = $"Based on ₹{remainingIncome:N2}, {request.InvestmentType} is recommended."
                },

                InvestmentOptions = investmentOptions,
                RiskBenefit = riskBenefit,
                IsOnboardingComplete = status.CompletedAt != null
            };
        }

    }
}

