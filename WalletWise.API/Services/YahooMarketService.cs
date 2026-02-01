using System.Net.Http.Json;
using Microsoft.Extensions.Logging;

namespace WalletWise.API.Services
{
    public class YahooMarketService
    {
        private readonly HttpClient _httpClient;
        private readonly ILogger<YahooMarketService> _logger;

        public YahooMarketService(HttpClient httpClient, ILogger<YahooMarketService> logger)
        {
            _httpClient = httpClient;
            _httpClient.BaseAddress = new Uri("https://query1.finance.yahoo.com/v8/finance/chart/");
            _logger = logger;
        }

        public async Task<decimal?> GetStockPriceAsync(string symbol)
        {
            try
            {
                var response = await _httpClient.GetAsync($"{symbol}?interval=1d&range=1d");

                if (!response.IsSuccessStatusCode)
                    return null;

                var data = await response.Content.ReadFromJsonAsync<YahooFinanceResponse>();
                return (decimal?)data?.Chart?.Result?.FirstOrDefault()?.Meta?.RegularMarketPrice;
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, $"Yahoo fetch failed for {symbol}");
                return null;
            }
        }

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
