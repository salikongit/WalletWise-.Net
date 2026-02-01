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
    [Tags("Finance")]
    public class FinanceController : ControllerBase
    {
        private readonly IFinancialCalculationService _calculationService;

        public FinanceController(IFinancialCalculationService calculationService)
        {
            _calculationService = calculationService;
        }

        private int GetUserId()
        {
            return int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        }

        /// <summary>
        /// Calculate EMI for given loan parameters
        /// </summary>
        [HttpPost("calculate-emi")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(EmiResponseDto))]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public IActionResult CalculateEmi([FromBody] EmiCalculationDto request)
        {
            try
            {
                var result = _calculationService.CalculateEmi(request);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        /// <summary>
        /// Calculate investment returns (SIP or Lumpsum)
        /// </summary>
        [HttpPost("calculate-investment")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(InvestmentResponseDto))]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public IActionResult CalculateInvestment([FromBody] InvestmentCalculationDto request)
        {
            try
            {
                var result = _calculationService.CalculateInvestment(request);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }
    }
}




