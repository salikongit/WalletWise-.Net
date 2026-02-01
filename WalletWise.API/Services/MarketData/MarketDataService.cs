using Microsoft.EntityFrameworkCore;
using WalletWise.API.Data;
using WalletWise.API.DTOs;


namespace WalletWise.API.Services.MarketData
{
    public class MarketDataService : IMarketDataService
    {
        private readonly WalletWiseDbContext _context;

        public MarketDataService(WalletWiseDbContext context)
        {
            _context = context;
        }

        // ================= SIP =================
        public async Task<List<InvestmentOptionDto>> GetSipFundsAsync(decimal maxMonthlyAmount)
        {
            return await _context.SipFunds
                .Where(s =>
                    s.IsActive &&
                    s.MinMonthlyAmount <= maxMonthlyAmount)
                .Select(s => new InvestmentOptionDto
                {
                    Symbol = s.FundCode,
                    Name = s.FundName,
                    Category = $"SIP - {s.Category}",
                    MinInvestment = s.MinMonthlyAmount,
                    MaxInvestment = s.MaxMonthlyAmount,
                    ExpectedReturn = s.ExpectedReturn,
                    Description = $"Lock-in: {s.LockInYears} years | Risk: {s.RiskLevel}"
                })
                .ToListAsync();
        }

        // ================= EQUITY =================
        public async Task<List<InvestmentOptionDto>> GetEquityStocksAsync(decimal budget)
        {
            return new List<InvestmentOptionDto>
    {
        new InvestmentOptionDto
        {
            Symbol = "TCS",
            Name = "Tata Consultancy Services",
            Category = "Equity",
            Price = 3850,
            CurrentPrice = 3850,
            MinInvestment = 3850,
            MaxInvestment = 3850 * 100,
            RiskLevel = "Medium",
            Description = "Blue-chip IT stock"
        },
        new InvestmentOptionDto
        {
            Symbol = "INFY",
            Name = "Infosys Ltd",
            Category = "Equity",
            Price = 1650,
            CurrentPrice = 1650,
            MinInvestment = 1650,
            MaxInvestment = 1650 * 100,
            RiskLevel = "Medium",
            Description = "Large-cap IT services"
        }
    };
        }



        // ================= FD =================
        public async Task<List<InvestmentOptionDto>> GetFixedDepositsAsync(decimal amount)
        {
            return await _context.FixedDeposits
                .Where(f =>
                    f.IsActive &&
                    f.MinInvestment <= amount)
                .Select(f => new InvestmentOptionDto
                {
                    Symbol = f.BankName,
                    Name = $"{f.BankName} FD ({f.TenureYears} Years)",
                    Category = "Fixed Deposit",
                    MinInvestment = f.MinInvestment,
                    MaxInvestment = f.MaxInvestment,
                    ExpectedReturn = f.InterestRate,
                    Description = "Guaranteed returns"
                })
                .ToListAsync();
        }
    }
}