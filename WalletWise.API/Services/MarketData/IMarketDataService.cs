using WalletWise.API.DTOs;

namespace WalletWise.API.Services.MarketData
{
    public interface IMarketDataService
    {
        Task<List<InvestmentOptionDto>> GetSipFundsAsync(decimal maxMonthlyAmount);
        Task<List<InvestmentOptionDto>> GetEquityStocksAsync(decimal budget);
        Task<List<InvestmentOptionDto>> GetFixedDepositsAsync(decimal amount);
    }
}