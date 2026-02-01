using Newtonsoft.Json.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;

namespace WalletWise.API.Services
{
    public class YahooFinanceService
    {
        private readonly HttpClient _http;

        public YahooFinanceService()
        {
            _http = new HttpClient();
            _http.DefaultRequestHeaders.UserAgent.ParseAdd("Mozilla/5.0 (Windows NT 10.0; Win64; x64)");
        }

        public async Task<object> GetQuote(string symbol)
        {
            try
            {
                var url = $"https://query1.finance.yahoo.com/v8/finance/chart/{symbol}";
                var response = await _http.GetStringAsync(url);

                var json = JObject.Parse(response);
                var meta = json["chart"]?["result"]?[0]?["meta"];

                return new
                {
                    symbol = meta?["symbol"]?.ToString(),
                    price = meta?["regularMarketPrice"]?.ToString(),
                    currency = meta?["currency"]?.ToString(),
                    exchange = meta?["exchangeName"]?.ToString()
                };
            }
            catch (Exception ex)
            {
                return new { error = ex.Message, symbol };
            }
        }
    }
}
