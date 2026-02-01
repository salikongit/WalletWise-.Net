using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WalletWise.API.Services.MarketData;

namespace WalletWise.API.Controllers
{
    [ApiController]
    [Route("api/market")]
    [Authorize]
    public class MarketController : ControllerBase
    {
        private readonly IMarketDataService _marketService;

        public MarketController(IMarketDataService marketService)
        {
            _marketService = marketService;
        }

        // ================= SIP FUNDS (based on monthly amount) =================
        [HttpGet("sip")]
        public async Task<IActionResult> GetSipFunds([FromQuery] decimal monthlyAmount)
        {
            if (monthlyAmount <= 0)
                return BadRequest(new { error = "Monthly amount must be greater than zero" });

            return Ok(await _marketService.GetSipFundsAsync(monthlyAmount));
        }

        // ================= EQUITY STOCKS (based on budget) =================
        [HttpGet("equity")]
        public async Task<IActionResult> GetEquityStocks([FromQuery] decimal budget)
        {
            if (budget <= 0)
                return BadRequest(new { error = "Budget must be greater than zero" });

            return Ok(await _marketService.GetEquityStocksAsync(budget));
        }

        // ================= FIXED DEPOSITS =================
        [HttpGet("fd")]
        public async Task<IActionResult> GetFDs([FromQuery] decimal amount)
        {
            if (amount <= 0)
                return BadRequest(new { error = "Amount must be greater than zero" });

            return Ok(await _marketService.GetFixedDepositsAsync(amount));
        }

        // ================= 🔥 PRICE / NAV ENDPOINTS (NEW) =================

        /// <summary>
        /// Get current equity prices (simulated market data)
        /// </summary>
        [HttpGet("equity/prices")]
        public IActionResult GetEquityPrices()
        {
            return Ok(new[]
            {
                new { Name = "Tata Consultancy Services", Price = 3850m },
                new { Name = "Infosys Ltd", Price = 1520m },
                new { Name = "HDFC Bank", Price = 1685m }
            });
        }

        /// <summary>
        /// Get SIP NAV values (simulated market data)
        /// </summary>
        [HttpGet("sip/nav")]
        public IActionResult GetSipNav()
        {
            return Ok(new[]
            {
                new { Name = "HDFC SIP", Nav = 102.45m },
                new { Name = "ICICI SIP", Nav = 98.30m },
                new { Name = "Axis SIP", Nav = 110.10m }
            });
        }
    }
}
