using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WalletWise.API.DTOs;
using WalletWise.API.Models;
using WalletWise.API.Services;

namespace WalletWise.API.Controllers
{
    [ApiController]
    [Route("api/investments")]
    [Tags("Investments")]
    public class InvestmentsController : ControllerBase
    {
        private readonly IStockService _stockService;

        public InvestmentsController(IStockService stockService)
        {
            _stockService = stockService;
        }

        /// <summary>
        /// 🔥 Real-time investment data (Yahoo-backed equities)
        /// </summary>
        /// <remarks>
        /// Public endpoint used by Real-Time Investments page
        /// </remarks>
        [AllowAnonymous] // 🔑 IMPORTANT
        [HttpGet("realtime")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(List<InvestmentOptionDto>))]
        public async Task<IActionResult> GetRealTimeInvestmentData(
            [FromQuery] InvestmentType? investmentType = null,
            [FromQuery] string? searchTerm = null)
        {
            try
            {
                var data = await _stockService
                    .GetRealTimeInvestmentDataAsync(investmentType, searchTerm);

                return Ok(data);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    error = "Failed to fetch real-time investment data",
                    details = ex.Message
                });
            }
        }

        /// <summary>
        /// Investment recommendations based on remaining income
        /// </summary>
        [Authorize]
        [HttpGet("recommendations")]
        public IActionResult GetInvestmentRecommendation(
            [FromQuery] InvestmentType investmentType,
            [FromQuery] decimal availableAmount)
        {
            if (availableAmount <= 0)
            {
                return BadRequest(new
                {
                    error = "No available amount for investment"
                });
            }

            var suggestion = new InvestmentSuggestionDto
            {
                RemainingIncome = availableAmount,
                SuggestedSip = investmentType == InvestmentType.SIP
                    ? Math.Round(availableAmount * 0.7m, 2)
                    : null,
                SuggestedLumpsum = investmentType == InvestmentType.Lumpsum
                    ? Math.Round(availableAmount * 0.2m, 2)
                    : null,
                InvestmentProfile = "Moderate",
                Recommendation = $"Based on ₹{availableAmount:N2}, {investmentType} is recommended."
            };

            return Ok(suggestion);
        }

        /// <summary>
        /// Risk & benefit details for an investment type
        /// </summary>
        [Authorize]
        [HttpGet("risk-benefit")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(RiskBenefitDto))]
        public async Task<IActionResult> GetRiskBenefit(
            [FromQuery] InvestmentType investmentType)
        {
            try
            {
                var riskBenefit = await _stockService
                    .GetRiskBenefitAsync(investmentType);

                return Ok(riskBenefit);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    error = "Failed to fetch risk/benefit information",
                    details = ex.Message
                });
            }
        }
    }
}
