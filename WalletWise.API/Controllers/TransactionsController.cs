using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using WalletWise.API.DTOs;
using WalletWise.API.Services;

namespace WalletWise.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    [Tags("Transactions")]
    public class TransactionsController : ControllerBase
    {
        private readonly ITransactionService _transactionService;

        public TransactionsController(ITransactionService transactionService)
        {
            _transactionService = transactionService;
        }

        private int GetUserId()
        {
            return int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        }

        /// <summary>
        /// Get all income transactions
        /// </summary>
        [HttpGet("income")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(List<IncomeDto>))]
        public async Task<IActionResult> GetIncomes([FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate)
        {
            var userId = GetUserId();
            var incomes = await _transactionService.GetIncomesAsync(userId, startDate, endDate);
            return Ok(incomes);
        }

        /// <summary>
        /// Get all expense transactions
        /// </summary>
        [HttpGet("expense")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(List<ExpenseDto>))]
        public async Task<IActionResult> GetExpenses([FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate)
        {
            var userId = GetUserId();
            var expenses = await _transactionService.GetExpensesAsync(userId, startDate, endDate);
            return Ok(expenses);
        }

        /// <summary>
        /// Add a new income transaction
        /// </summary>
        [HttpPost("income")]
        [ProducesResponseType(StatusCodes.Status201Created, Type = typeof(IncomeDto))]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> AddIncome([FromBody] IncomeDto incomeDto)
        {
            try
            {
                var userId = GetUserId();
                var income = await _transactionService.AddIncomeAsync(userId, incomeDto);
                return CreatedAtAction(nameof(GetIncomes), new { }, income);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        /// <summary>
        /// Add a new expense transaction
        /// </summary>
        [HttpPost("expense")]
        [ProducesResponseType(StatusCodes.Status201Created, Type = typeof(ExpenseDto))]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> AddExpense([FromBody] ExpenseDto expenseDto)
        {
            try
            {
                var userId = GetUserId();
                var expense = await _transactionService.AddExpenseAsync(userId, expenseDto);
                return CreatedAtAction(nameof(GetExpenses), new { }, expense);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        /// <summary>
        /// Update an income transaction
        /// </summary>
        [HttpPut("income/{incomeId}")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IncomeDto))]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> UpdateIncome(int incomeId, [FromBody] IncomeDto incomeDto)
        {
            try
            {
                var userId = GetUserId();
                var income = await _transactionService.UpdateIncomeAsync(incomeId, userId, incomeDto);
                return Ok(income);
            }
            catch (UnauthorizedAccessException ex)
            {
                return NotFound(new { error = ex.Message });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        /// <summary>
        /// Update an expense transaction
        /// </summary>
        [HttpPut("expense/{expenseId}")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(ExpenseDto))]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> UpdateExpense(int expenseId, [FromBody] ExpenseDto expenseDto)
        {
            try
            {
                var userId = GetUserId();
                var expense = await _transactionService.UpdateExpenseAsync(expenseId, userId, expenseDto);
                return Ok(expense);
            }
            catch (UnauthorizedAccessException ex)
            {
                return NotFound(new { error = ex.Message });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        /// <summary>
        /// Delete an income transaction
        /// </summary>
        [HttpDelete("income/{incomeId}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> DeleteIncome(int incomeId)
        {
            var userId = GetUserId();
            var result = await _transactionService.DeleteIncomeAsync(incomeId, userId);
            if (!result)
            {
                return NotFound(new { error = "Income not found" });
            }
            return Ok(new { message = "Income deleted successfully" });
        }

        /// <summary>
        /// Delete an expense transaction
        /// </summary>
        [HttpDelete("expense/{expenseId}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> DeleteExpense(int expenseId)
        {
            var userId = GetUserId();
            var result = await _transactionService.DeleteExpenseAsync(expenseId, userId);
            if (!result)
            {
                return NotFound(new { error = "Expense not found" });
            }
            return Ok(new { message = "Expense deleted successfully" });
        }
    }
}




