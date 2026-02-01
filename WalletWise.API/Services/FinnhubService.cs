using System.Net.Http;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;

namespace WalletWise.API.Services
{
    public class FinnhubService
    {
        private readonly string _apiKey;
        private readonly HttpClient _http;

        public FinnhubService(string apiKey)
        {
            _apiKey = apiKey;
            _http = new HttpClient();
        }

        public async Task<JObject> GetStockQuote(string symbol)
        {
            string url = $"https://finnhub.io/api/v1/quote?symbol={symbol}&token={_apiKey}";
            var response = await _http.GetStringAsync(url);
            return JObject.Parse(response);
        }
    }
}
