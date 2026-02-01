using Microsoft.EntityFrameworkCore;
using WalletWise.API.Data;
using WalletWise.API.DTOs;
using WalletWise.API.Models;

namespace WalletWise.API.Services
{
    public class InvestmentProductService : IInvestmentProductService
    {
        private readonly WalletWiseDbContext _context;

        public InvestmentProductService(WalletWiseDbContext context)
        {
            _context = context;
        }

        public async Task<List<InvestmentOptionDto>> GetProductsAsync(
            InvestmentType investmentType,
            decimal availableAmount)
        {
            return investmentType switch
            {
                InvestmentType.SIP => await GetSipProductsAsync(availableAmount),
                InvestmentType.Lumpsum => await GetSipProductsAsync(availableAmount), // reuse SIP funds
                InvestmentType.Equity => await GetEquityProductsAsync(availableAmount),
                InvestmentType.FD => await GetFdProductsAsync(availableAmount),
                _ => new List<InvestmentOptionDto>()
            };
        }

        // ---------------- SIP ----------------
        private async Task<List<InvestmentOptionDto>> GetSipProductsAsync(decimal amount)
        {
            return await _context.SipFunds
                .Where(f => f.IsActive && f.MinMonthlyAmount <= amount)
                .Select(f => new InvestmentOptionDto
                {
                    Name = f.FundName,
                    MinInvestment = f.MinMonthlyAmount,
                    MaxInvestment = f.MaxMonthlyAmount,
                    ExpectedReturn = f.ExpectedReturn,
                    Category = "SIP",
                    RiskLevel = f.RiskLevel,
                    Description = $"{f.Category} | Lock-in: {f.LockInYears} years"
                })
                .ToListAsync();
        }

        // ---------------- EQUITY ----------------
        private async Task<List<InvestmentOptionDto>> GetEquityProductsAsync(decimal amount)
        {
            return await _context.EquityStocks
                .Where(s => s.IsActive && s.CurrentPrice <= amount)
                .Select(s => new InvestmentOptionDto
                {
                    Symbol = s.Symbol,
                    Name = s.CompanyName,
                    Price = s.CurrentPrice,
                    MinInvestment = s.CurrentPrice,
                    MaxInvestment = amount,
                    Category = "Equity",
                    RiskLevel = "High"
                })
                .ToListAsync();
        }

        // ---------------- FD ----------------
        private async Task<List<InvestmentOptionDto>> GetFdProductsAsync(decimal amount)
        {
            return await _context.FixedDeposits
                .Where(fd => fd.IsActive && fd.MinInvestment <= amount)
                .Select(fd => new InvestmentOptionDto
                {
                    Name = fd.BankName,
                    MinInvestment = fd.MinInvestment,
                    MaxInvestment = fd.MaxInvestment,
                    ExpectedReturn = fd.InterestRate,
                    Category = "FD",
                    RiskLevel = "Low"
                })
                .ToListAsync();
        }
    }
}
