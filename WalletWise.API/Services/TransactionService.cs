using WalletWise.API.DTOs;
using WalletWise.API.Models;
using WalletWise.API.Repositories;

namespace WalletWise.API.Services
{
    public class TransactionService : ITransactionService
    {
        private readonly IIncomeRepository _incomeRepository;
        private readonly IExpenseRepository _expenseRepository;
        private readonly IFinancialProfileRepository _profileRepository;

        public TransactionService(
            IIncomeRepository incomeRepository,
            IExpenseRepository expenseRepository,
            IFinancialProfileRepository profileRepository)
        {
            _incomeRepository = incomeRepository;
            _expenseRepository = expenseRepository;
            _profileRepository = profileRepository;
        }

        public async Task<IncomeDto> AddIncomeAsync(int userId, IncomeDto incomeDto)
        {
            var income = new Income
            {
                UserId = userId,
                IncomeSource = incomeDto.IncomeSource,
                Amount = incomeDto.Amount,
                IncomeDate = incomeDto.IncomeDate,
                Description = incomeDto.Description,
                Category = incomeDto.Category,
                CreatedAt = DateTime.UtcNow
            };

            var created = await _incomeRepository.CreateAsync(income);
            await UpdateFinancialProfileAsync(userId);

            return new IncomeDto
            {
                IncomeId = created.IncomeId,
                IncomeSource = created.IncomeSource,
                Amount = created.Amount,
                IncomeDate = created.IncomeDate,
                Description = created.Description,
                Category = created.Category
            };
        }

        public async Task<ExpenseDto> AddExpenseAsync(int userId, ExpenseDto expenseDto)
        {
            var expense = new Expense
            {
                UserId = userId,
                ExpenseName = expenseDto.ExpenseName,
                Amount = expenseDto.Amount,
                ExpenseDate = expenseDto.ExpenseDate,
                Description = expenseDto.Description,
                Category = expenseDto.Category,
                CreatedAt = DateTime.UtcNow
            };

            var created = await _expenseRepository.CreateAsync(expense);
            await UpdateFinancialProfileAsync(userId);

            return new ExpenseDto
            {
                ExpenseId = created.ExpenseId,
                ExpenseName = created.ExpenseName,
                Amount = created.Amount,
                ExpenseDate = created.ExpenseDate,
                Description = created.Description,
                Category = created.Category
            };
        }

        public async Task<List<IncomeDto>> GetIncomesAsync(int userId, DateTime? startDate = null, DateTime? endDate = null)
        {
            var incomes = await _incomeRepository.GetByUserIdAsync(userId, startDate, endDate);
            return incomes.Select(i => new IncomeDto
            {
                IncomeId = i.IncomeId,
                IncomeSource = i.IncomeSource,
                Amount = i.Amount,
                IncomeDate = i.IncomeDate,
                Description = i.Description,
                Category = i.Category
            }).ToList();
        }

        public async Task<List<ExpenseDto>> GetExpensesAsync(int userId, DateTime? startDate = null, DateTime? endDate = null)
        {
            var expenses = await _expenseRepository.GetByUserIdAsync(userId, startDate, endDate);
            return expenses.Select(e => new ExpenseDto
            {
                ExpenseId = e.ExpenseId,
                ExpenseName = e.ExpenseName,
                Amount = e.Amount,
                ExpenseDate = e.ExpenseDate,
                Description = e.Description,
                Category = e.Category
            }).ToList();
        }

        public async Task<IncomeDto> UpdateIncomeAsync(int incomeId, int userId, IncomeDto incomeDto)
        {
            var income = await _incomeRepository.GetByIdAsync(incomeId);
            if (income == null || income.UserId != userId)
            {
                throw new UnauthorizedAccessException("Income not found or access denied");
            }

            income.IncomeSource = incomeDto.IncomeSource;
            income.Amount = incomeDto.Amount;
            income.IncomeDate = incomeDto.IncomeDate;
            income.Description = incomeDto.Description;
            income.Category = incomeDto.Category;

            var updated = await _incomeRepository.UpdateAsync(income);
            await UpdateFinancialProfileAsync(userId);

            return new IncomeDto
            {
                IncomeId = updated.IncomeId,
                IncomeSource = updated.IncomeSource,
                Amount = updated.Amount,
                IncomeDate = updated.IncomeDate,
                Description = updated.Description,
                Category = updated.Category
            };
        }

        public async Task<ExpenseDto> UpdateExpenseAsync(int expenseId, int userId, ExpenseDto expenseDto)
        {
            var expense = await _expenseRepository.GetByIdAsync(expenseId);
            if (expense == null || expense.UserId != userId)
            {
                throw new UnauthorizedAccessException("Expense not found or access denied");
            }

            expense.ExpenseName = expenseDto.ExpenseName;
            expense.Amount = expenseDto.Amount;
            expense.ExpenseDate = expenseDto.ExpenseDate;
            expense.Description = expenseDto.Description;
            expense.Category = expenseDto.Category;

            var updated = await _expenseRepository.UpdateAsync(expense);
            await UpdateFinancialProfileAsync(userId);

            return new ExpenseDto
            {
                ExpenseId = updated.ExpenseId,
                ExpenseName = updated.ExpenseName,
                Amount = updated.Amount,
                ExpenseDate = updated.ExpenseDate,
                Description = updated.Description,
                Category = updated.Category
            };
        }

        public async Task<bool> DeleteIncomeAsync(int incomeId, int userId)
        {
            var income = await _incomeRepository.GetByIdAsync(incomeId);
            if (income == null || income.UserId != userId)
            {
                return false;
            }

            var result = await _incomeRepository.DeleteAsync(incomeId);
            if (result)
            {
                await UpdateFinancialProfileAsync(userId);
            }

            return result;
        }

        public async Task<bool> DeleteExpenseAsync(int expenseId, int userId)
        {
            var expense = await _expenseRepository.GetByIdAsync(expenseId);
            if (expense == null || expense.UserId != userId)
            {
                return false;
            }

            var result = await _expenseRepository.DeleteAsync(expenseId);
            if (result)
            {
                await UpdateFinancialProfileAsync(userId);
            }

            return result;
        }

        private async Task UpdateFinancialProfileAsync(int userId)
        {
            var totalIncome = await _incomeRepository.GetTotalIncomeByUserIdAsync(userId);
            var totalExpenses = await _expenseRepository.GetTotalExpenseByUserIdAsync(userId);
            var totalSavings = totalIncome - totalExpenses;

            var profile = await _profileRepository.GetByUserIdAsync(userId);
            if (profile == null)
            {
                profile = new FinancialProfile
                {
                    UserId = userId,
                    TotalIncome = totalIncome,
                    TotalExpenses = totalExpenses,
                    TotalSavings = totalSavings,
                    LastUpdated = DateTime.UtcNow
                };
            }
            else
            {
                profile.TotalIncome = totalIncome;
                profile.TotalExpenses = totalExpenses;
                profile.TotalSavings = totalSavings;
                profile.LastUpdated = DateTime.UtcNow;
            }

            await _profileRepository.CreateOrUpdateAsync(profile);
        }
    }
}




