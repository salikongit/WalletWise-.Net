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
    [Tags("Loans")]
    public class LoansController : ControllerBase
    {
        private readonly ILoanService _loanService;

        public LoansController(ILoanService loanService)
        {
            _loanService = loanService;
        }

        private int GetUserId()
        {
            return int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        }

        /// <summary>
        /// Get all loans for the authenticated user
        /// </summary>
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(List<LoanDto>))]
        public async Task<IActionResult> GetLoans()
        {
            var userId = GetUserId();
            var loans = await _loanService.GetUserLoansAsync(userId);
            return Ok(loans);
        }

        /// <summary>
        /// Get a specific loan by ID
        /// </summary>
        [HttpGet("{loanId}")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(LoanDto))]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetLoan(int loanId)
        {
            var userId = GetUserId();
            var loan = await _loanService.GetLoanByIdAsync(loanId, userId);
            if (loan == null)
            {
                return NotFound(new { error = "Loan not found" });
            }
            return Ok(loan);
        }

        /// <summary>
        /// Create a new loan
        /// </summary>
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created, Type = typeof(LoanDto))]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> CreateLoan([FromBody] LoanDto loanDto)
        {
            try
            {
                var userId = GetUserId();
                var loan = await _loanService.CreateLoanAsync(userId, loanDto);
                return CreatedAtAction(nameof(GetLoan), new { loanId = loan.LoanId }, loan);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        /// <summary>
        /// Update an existing loan
        /// </summary>
        [HttpPut("{loanId}")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(LoanDto))]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> UpdateLoan(int loanId, [FromBody] LoanDto loanDto)
        {
            try
            {
                var userId = GetUserId();
                var loan = await _loanService.UpdateLoanAsync(loanId, userId, loanDto);
                return Ok(loan);
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
        /// Delete a loan
        /// </summary>
        [HttpDelete("{loanId}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> DeleteLoan(int loanId)
        {
            var userId = GetUserId();
            var result = await _loanService.DeleteLoanAsync(loanId, userId);
            if (!result)
            {
                return NotFound(new { error = "Loan not found" });
            }
            return Ok(new { message = "Loan deleted successfully" });
        }

        /// <summary>
        /// Get amortization schedule for a loan
        /// </summary>
        [HttpGet("{loanId}/amortization")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(EmiResponseDto))]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetAmortization(int loanId)
        {
            try
            {
                var userId = GetUserId();
                var schedule = await _loanService.GetLoanAmortizationAsync(loanId, userId);
                return Ok(schedule);
            }
            catch (UnauthorizedAccessException ex)
            {
                return NotFound(new { error = ex.Message });
            }
        }
    }
}




