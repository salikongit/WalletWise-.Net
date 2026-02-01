using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using WalletWise.API.Services;

namespace WalletWise.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    [Tags("Reports")]
    public class ReportsController : ControllerBase
    {
        private readonly IPdfService _pdfService;

        public ReportsController(IPdfService pdfService)
        {
            _pdfService = pdfService;
        }

        private int GetUserId()
        {
            return int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        }

        /// <summary>
        /// Generate and download financial report as PDF
        /// </summary>
        [HttpGet("financial-report")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GenerateFinancialReport()
        {
            try
            {
                var userId = GetUserId();
                var pdfBytes = await _pdfService.GenerateFinancialReportAsync(userId);
                return File(pdfBytes, "application/pdf", $"FinancialReport_{userId}_{DateTime.UtcNow:yyyyMMdd}.pdf");
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { error = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Failed to generate report", details = ex.Message });
            }
        }
    }
}




