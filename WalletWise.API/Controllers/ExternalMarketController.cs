using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using WalletWise.API.Services;
using System.Net.Http;

namespace WalletWise.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ExternalMarketController : ControllerBase
    {
        private readonly YahooFinanceService _yahoo;

        public ExternalMarketController(YahooFinanceService yahoo)
        {
            _yahoo = yahoo;
        }

        // ----------------------------------------------------
        // 🔹 Get NIFTY 50 stock list from NSE (CLEAN DATA)
        // URL: GET http://localhost:5000/api/market/nse-list
        // ----------------------------------------------------
        [HttpGet("nse-list")]
        public async Task<IActionResult> GetNseList()
        {
            try
            {
                using var client = new HttpClient();

                client.DefaultRequestHeaders.Add("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64)");
                client.DefaultRequestHeaders.Add("Accept", "application/json, text/plain, */*");
                client.DefaultRequestHeaders.Add("Accept-Language", "en-US,en;q=0.9");
                client.DefaultRequestHeaders.Add("Referer", "https://www.nseindia.com/");
                client.DefaultRequestHeaders.Add("Origin", "https://www.nseindia.com");
                client.DefaultRequestHeaders.Add("Host", "www.nseindia.com");
                client.DefaultRequestHeaders.Add("Connection", "keep-alive");

                var htmlResponse = await client.GetAsync("https://www.nseindia.com/api/equity-stockIndices?index=NIFTY%2050");
                var json = await htmlResponse.Content.ReadAsStringAsync();

                var parsed = JObject.Parse(json);
                var data = parsed["data"];
                if (data == null)
                    return BadRequest(new { message = "No data returned from NSE." });

                var clean = data.Select(x => new {
                    symbol = x["symbol"]?.ToString(),
                    name = x["meta"]?["companyName"]?.ToString() ?? x["symbol"]?.ToString()
                });

                return Ok(clean);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }


        // ----------------------------------------------------
        // 🔹 Yahoo Finance NSE price endpoint
        // URL: GET http://localhost:5000/api/market/yahoo/TCS.NS
        // ----------------------------------------------------
        [HttpGet("yahoo/{symbol}")]
        public async Task<IActionResult> GetYahooQuote(string symbol)
        {
            var data = await _yahoo.GetQuote(symbol);
            return Ok(data);
        }
    }
}
