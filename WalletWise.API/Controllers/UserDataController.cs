using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using WalletWise.API.Models;
using WalletWise.API.Repositories;
using WalletWise.API.Services;

namespace WalletWise.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Customer")]
    [Tags("User Data")]
    public class UserDataController : ControllerBase
    {
        private readonly IUserRepository _userRepository;
        private readonly ILoanRepository _loanRepository;
        private readonly IExpenseRepository _expenseRepository;
        private readonly IIncomeRepository _incomeRepository;
        private readonly IInvestmentRepository _investmentRepository;
        private readonly IAmortizationScheduleRepository _amortizationScheduleRepository;

        public UserDataController(
            IUserRepository userRepository,
            ILoanRepository loanRepository,
            IExpenseRepository expenseRepository,
            IIncomeRepository incomeRepository,
            IInvestmentRepository investmentRepository,
            IAmortizationScheduleRepository amortizationScheduleRepository)
        {
            _userRepository = userRepository;
            _loanRepository = loanRepository;
            _expenseRepository = expenseRepository;
            _incomeRepository = incomeRepository;
            _investmentRepository = investmentRepository;
            _amortizationScheduleRepository = amortizationScheduleRepository;
        }

        private int GetUserId()
        {
            return int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        }

        /// <summary>
        /// Delete all user data and reset onboarding status
        /// </summary>
        [HttpDelete("reset")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> ResetUserData([FromServices] IUserOnboardingStatusRepository onboardingStatusRepository)
        {
            try
            {
                var userId = GetUserId();

                // Get all user loans first to delete amortization schedules
                var loans = await _loanRepository.GetByUserIdAsync(userId);
                foreach (var loan in loans)
                {
                    await _amortizationScheduleRepository.DeleteByLoanIdAsync(loan.LoanId);
                    await _loanRepository.DeleteAsync(loan.LoanId);
                }

                // Delete investments
                var investments = await _investmentRepository.GetByUserIdAsync(userId);
                foreach (var investment in investments)
                {
                    await _investmentRepository.DeleteAsync(investment.InvestmentId);
                }

                // Delete expenses
                var expenses = await _expenseRepository.GetByUserIdAsync(userId);
                foreach (var expense in expenses)
                {
                    await _expenseRepository.DeleteAsync(expense.ExpenseId);
                }

                // Delete incomes
                var incomes = await _incomeRepository.GetByUserIdAsync(userId);
                foreach (var income in incomes)
                {
                    await _incomeRepository.DeleteAsync(income.IncomeId);
                }

                // Reset onboarding status
                var onboardingStatus = await onboardingStatusRepository.GetByUserIdAsync(userId);
                if (onboardingStatus != null)
                {
                    onboardingStatus.SalaryEntered = false;
                    onboardingStatus.LoansEntered = false;
                    onboardingStatus.ExpensesEntered = false;
                    
                    onboardingStatus.CompletedAt = null;

                    await onboardingStatusRepository.UpdateAsync(onboardingStatus);
                }
                else
                {
                    onboardingStatus = new UserOnboardingStatus
                    {
                        UserId = userId,
                        SalaryEntered = false,
                        LoansEntered = false,
                        ExpensesEntered = false,
                        
                    };

                    await onboardingStatusRepository.CreateAsync(onboardingStatus);
                }


                return Ok(new { message = "All data deleted successfully. You can start fresh!" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }
    }
}

