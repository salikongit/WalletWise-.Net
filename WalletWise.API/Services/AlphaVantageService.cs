using System.Net.Http;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;

namespace WalletWise.API.Services
{
    public class AlphaVantageService
    {
        private readonly string _apiKey;
        private readonly HttpClient _http;

        public AlphaVantageService(string apiKey)
        {
            _apiKey = apiKey;
            _http = new HttpClient();
        }

        public async Task<JObject> GetQuote(string symbol)
        {
            string url = $"https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol={symbol}&apikey={_apiKey}";

            var response = await _http.GetAsync(url);
            string data = await response.Content.ReadAsStringAsync();

            return JObject.Parse(data);
        }
    }
}
