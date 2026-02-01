using System.Net.Http.Json;
using WalletWise.API.DTOs;
using WalletWise.API.Models;
using WalletWise.API.Services.MarketData;

namespace WalletWise.API.Services
{
    public class StockService : IStockService
    {
        private readonly HttpClient _httpClient;
        private readonly ILogger<StockService> _logger;
        private readonly IMarketDataService _marketDataService;

        public StockService(
            HttpClient httpClient,
            ILogger<StockService> logger,
            IMarketDataService marketDataService)
        {
            _httpClient = httpClient;
            _httpClient.BaseAddress =
                 new Uri("https://query1.finance.yahoo.com/v8/finance/chart/");

            _httpClient.DefaultRequestHeaders.UserAgent.ParseAdd(
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
            );
            _logger = logger;
            _marketDataService = marketDataService;
        }

        // ==================================================
        // MAIN ENTRY (Controller calls this)
        // ==================================================
        public async Task<List<InvestmentOptionDto>> GetInvestmentSuggestionsAsync(
            InvestmentType investmentType,
            decimal maxBudget)
        {
            try
            {
                return investmentType switch
                {
                    InvestmentType.SIP =>
                        await _marketDataService.GetSipFundsAsync(maxBudget),

                    InvestmentType.Equity =>
                        await GetEquityWithLivePricesAsync(maxBudget),

                    InvestmentType.FD =>
                        await _marketDataService.GetFixedDepositsAsync(maxBudget),

                    InvestmentType.Lumpsum =>
                        await GetLumpsumSuggestionsWithPricesAsync(maxBudget),

                    _ => new List<InvestmentOptionDto>()
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching investment suggestions");
                return new List<InvestmentOptionDto>();
            }
        }

        // ==================================================
        // REAL-TIME MARKET (OPTIONAL API)
        // ==================================================
        public async Task<List<InvestmentOptionDto>> GetRealTimeInvestmentDataAsync(
            InvestmentType? investmentType = null,
            string? searchTerm = null)
        {
            var options = new List<InvestmentOptionDto>();

            if (investmentType.HasValue && investmentType.Value != InvestmentType.Equity)
                return options;

            var stocks = new[] { "RELIANCE.NS", "TCS.NS", "INFY.NS" };

            foreach (var symbol in stocks)
            {
                var price = await GetStockPriceAsync(symbol);
                if (price == null) continue;

                options.Add(new InvestmentOptionDto
                {
                    Symbol = symbol,
                    Name = symbol.Replace(".NS", ""),
                    Category = "Equity",
                    Price = price.Value,
                    CurrentPrice = price.Value,
                    MinInvestment = price.Value,
                    MaxInvestment = price.Value * 100,
                    RiskLevel = "Medium"
                });
            }

            return options;
        }

        // ==================================================
        // 🔥 EQUITY WITH YAHOO PRICE ENRICHMENT
        // ==================================================
        private async Task<List<InvestmentOptionDto>> GetEquityWithLivePricesAsync(decimal budget)
        {
            var equities = await _marketDataService.GetEquityStocksAsync(budget);

            foreach (var equity in equities)
            {
                if (string.IsNullOrWhiteSpace(equity.Symbol))
                    continue;

                var price = await GetStockPriceAsync(equity.Symbol);

                if (price == null)
                    continue;

                equity.Price = price.Value;
                equity.CurrentPrice = price.Value;
                equity.MinInvestment = price.Value;        // 1 share
                equity.MaxInvestment = price.Value * 100; // cap
                equity.Category = "Equity";
            }

            return equities
                .Where(e => e.Price != null)
                .ToList();
        }

        // ==================================================
        // 🔥 LUMPSUM = EQUITY (LIVE) + FD
        // ==================================================
        private async Task<List<InvestmentOptionDto>> GetLumpsumSuggestionsWithPricesAsync(decimal budget)
        {
            var equities = await GetEquityWithLivePricesAsync(budget);
            var fds = await _marketDataService.GetFixedDepositsAsync(budget);

            return equities.Concat(fds).ToList();
        }

        // ==================================================
        // RISK & BENEFITS
        // ==================================================
        public Task<RiskBenefitDto> GetRiskBenefitAsync(InvestmentType investmentType)
        {
            var riskBenefit = investmentType switch
            {
                InvestmentType.SIP => new RiskBenefitDto
                {
                    RiskLevel = "Medium",
                    Benefits = new()
                    {
                        "Rupee cost averaging",
                        "Disciplined investing"
                    },
                    Risks = new()
                    {
                        "Market volatility",
                        "No guaranteed returns"
                    }
                },

                InvestmentType.Equity => new RiskBenefitDto
                {
                    RiskLevel = "High",
                    Benefits = new()
                    {
                        "High growth potential",
                        "Liquidity"
                    },
                    Risks = new()
                    {
                        "High volatility",
                        "Capital loss risk"
                    }
                },

                InvestmentType.FD => new RiskBenefitDto
                {
                    RiskLevel = "Low",
                    Benefits = new()
                    {
                        "Guaranteed returns",
                        "Capital safety"
                    },
                    Risks = new()
                    {
                        "Lower returns",
                        "Inflation risk"
                    }
                },

                InvestmentType.Lumpsum => new RiskBenefitDto
                {
                    RiskLevel = "Medium",
                    Benefits = new()
                    {
                        "One-time investment",
                        "Higher compounding potential",
                        "Flexible asset allocation"
                    },
                    Risks = new()
                    {
                        "Market timing risk",
                        "Short-term volatility"
                    }
                },

                _ => new RiskBenefitDto()
            };

            return Task.FromResult(riskBenefit);
        }

        // ==================================================
        // YAHOO PRICE HELPER
        // ==================================================
        private async Task<decimal?> GetStockPriceAsync(string symbol)
        {
            try
            {
                var response =
                    await _httpClient.GetAsync($"{symbol}?interval=1d&range=1d");

                if (!response.IsSuccessStatusCode)
                    return null;

                var data =
                    await response.Content.ReadFromJsonAsync<YahooFinanceResponse>();

                return data?.Chart?.Result?
                    .FirstOrDefault()?
                    .Meta?
                    .RegularMarketPrice is double price
                        ? (decimal)price
                        : null;
            }
            catch
            {
                return null;
            }
        }

        // ==================================================
        // YAHOO RESPONSE MODELS
        // ==================================================
        private class YahooFinanceResponse
        {
            public ChartData? Chart { get; set; }
        }

        private class ChartData
        {
            public List<ResultData>? Result { get; set; }
        }

        private class ResultData
        {
            public MetaData? Meta { get; set; }
        }

        private class MetaData
        {
            public double? RegularMarketPrice { get; set; }
        }
    }
}
