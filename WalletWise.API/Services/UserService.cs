using WalletWise.API.DTOs;
using WalletWise.API.Repositories;

namespace WalletWise.API.Services
{
    public class UserService : IUserService
    {
        private readonly IIncomeRepository _incomeRepository;
        private readonly IExpenseRepository _expenseRepository;
        private readonly ILoanRepository _loanRepository;
        private readonly IInvestmentRepository _investmentRepository;

        public UserService(
            IIncomeRepository incomeRepository,
            IExpenseRepository expenseRepository,
            ILoanRepository loanRepository,
            IInvestmentRepository investmentRepository)
        {
            _incomeRepository = incomeRepository;
            _expenseRepository = expenseRepository;
            _loanRepository = loanRepository;
            _investmentRepository = investmentRepository;
        }

        public async Task<DashboardDto> GetDashboardAsync(int userId)
        {
            var incomes = await _incomeRepository.GetByUserIdAsync(userId);
            var expenses = await _expenseRepository.GetByUserIdAsync(userId);
            var loans = await _loanRepository.GetByUserIdAsync(userId);
            var investments = await _investmentRepository.GetByUserIdAsync(userId);

            var totalIncome = incomes.Sum(i => i.Amount);
            var totalExpenses = expenses.Sum(e => e.Amount);
            var totalMonthlyEmi = loans.Sum(l => l.EmiAmount ?? 0);
            var totalSavings = totalIncome - totalExpenses - totalMonthlyEmi;
            var totalInvestments = investments.Sum(i => i.PrincipalAmount);
            var totalLoans = loans.Sum(l => l.PrincipalAmount);

            return new DashboardDto
            {
                TotalIncome = totalIncome,
                TotalExpenses = totalExpenses,
                TotalSavings = totalSavings,
                TotalMonthlyEmi = totalMonthlyEmi,
                AvailableForInvestment = Math.Max(0, totalSavings), // Ensure non-negative
                TotalInvestments = totalInvestments,
                TotalLoans = totalLoans,
                RecentIncomes = incomes.Take(5).Select(i => new RecentIncomeDto
                {
                    IncomeId = i.IncomeId,
                    IncomeSource = i.IncomeSource,
                    Amount = i.Amount,
                    IncomeDate = i.IncomeDate,
                    Category = i.Category
                }).ToList(),
                RecentExpenses = expenses.Take(5).Select(e => new RecentExpenseDto
                {
                    ExpenseId = e.ExpenseId,
                    ExpenseName = e.ExpenseName,
                    Amount = e.Amount,
                    ExpenseDate = e.ExpenseDate,
                    Category = e.Category
                }).ToList(),
                ActiveLoans = loans.Select(l => new ActiveLoanDto
                {
                    LoanId = l.LoanId,
                    LoanName = l.LoanName,
                    PrincipalAmount = l.PrincipalAmount,
                    EmiAmount = l.EmiAmount ?? 0,
                    TenureMonths = l.TenureMonths
                }).ToList(),
                ActiveInvestments = investments.Select(i => new ActiveInvestmentDto
                {
                    InvestmentId = i.InvestmentId,
                    InvestmentName = i.InvestmentName,
                    InvestmentType = i.InvestmentType,
                    PrincipalAmount = i.PrincipalAmount,
                    ExpectedFutureValue = i.ExpectedFutureValue
                }).ToList()
            };
        }
    }
}




