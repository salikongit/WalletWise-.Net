using Microsoft.EntityFrameworkCore;
using WalletWise.API.Data;
using WalletWise.API.DTOs;
using WalletWise.API.Models;

namespace WalletWise.API.Services
{
    public class RecommendationService : IRecommendationService
    {
        private readonly WalletWiseDbContext _context;

        public RecommendationService(WalletWiseDbContext context)
        {
            _context = context;
        }

        public async Task<InvestmentSuggestionResponseDto> GetRecommendationsAsync(int userId)
        {
            var onboarding = await _context.UserOnboardingStatuses
                .FirstOrDefaultAsync(x => x.UserId == userId);

            if (onboarding == null || onboarding.SelectedInvestmentType == null)
                throw new InvalidOperationException("Onboarding not completed.");

            var remainingIncome = await GetRemainingIncome(userId);
            var type = onboarding.SelectedInvestmentType;

            var options = type switch
            {
                InvestmentType.SIP => await GetSipOptions(remainingIncome),
                InvestmentType.Lumpsum => await GetSipOptions(remainingIncome),
                InvestmentType.Equity => await GetEquityOptions(remainingIncome),
                InvestmentType.FD => await GetFdOptions(remainingIncome),
                _ => new List<InvestmentOptionDto>()
            };

            return new InvestmentSuggestionResponseDto
            {
                RemainingIncome = remainingIncome,
                InvestmentType = type,
                InvestmentTypeName = type.ToString(),
                InvestmentOptions = options,
                RiskBenefit = GetRiskBenefit(type)
            };
        }

        private async Task<decimal> GetRemainingIncome(int userId)
        {
            var income = await _context.Incomes
                .Where(i => i.UserId == userId)
                .SumAsync(i => i.Amount);

            var expenses = await _context.Expenses
                .Where(e => e.UserId == userId)
                .SumAsync(e => e.Amount);

            var emi = await _context.Loans
                 .Where(l => l.UserId == userId && l.EmiAmount != null)
                 .SumAsync(l => l.EmiAmount ?? 0);

            return income - expenses - emi;
        }

        private async Task<List<InvestmentOptionDto>> GetSipOptions(decimal budget)
        {
            return await _context.SipFunds
                .Where(s => s.MinMonthlyAmount <= budget && s.IsActive)
                .Select(s => new InvestmentOptionDto
                {
                    Name = s.FundName,
                    MinInvestment = s.MinMonthlyAmount,
                    MaxInvestment = budget,
                    ExpectedReturn = s.ExpectedReturn,
                    Category = "SIP"
                })
                .ToListAsync();
        }

        private async Task<List<InvestmentOptionDto>> GetEquityOptions(decimal budget)
        {
            return await _context.EquityStocks
                .Where(e => e.CurrentPrice <= budget && e.IsActive)
                .Select(e => new InvestmentOptionDto
                {
                    Symbol = e.Symbol,
                    Name = e.CompanyName,
                    Price = e.CurrentPrice,
                    MinInvestment = e.CurrentPrice,
                    MaxInvestment = budget,
                    Category = "Equity"
                })
                .ToListAsync();
        }

        private async Task<List<InvestmentOptionDto>> GetFdOptions(decimal budget)
        {
            return await _context.FixedDeposits
                .Where(f => f.MinInvestment <= budget && f.IsActive)
                .Select(f => new InvestmentOptionDto
                {
                    Name = f.BankName,
                    MinInvestment = f.MinInvestment,
                    MaxInvestment = f.MaxInvestment,
                    ExpectedReturn = f.InterestRate,
                    Category = "FD"
                })
                .ToListAsync();
        }

        private RiskBenefitDto GetRiskBenefit(InvestmentType type)
        {
            return type switch
            {
                InvestmentType.SIP => new RiskBenefitDto
                {
                    RiskLevel = "Medium",
                    Benefits = { "Disciplined investing", "Rupee cost averaging" },
                    Risks = { "Market volatility" }
                },
                InvestmentType.Equity => new RiskBenefitDto
                {
                    RiskLevel = "High",
                    Benefits = { "High growth potential" },
                    Risks = { "High volatility" }
                },
                InvestmentType.FD => new RiskBenefitDto
                {
                    RiskLevel = "Low",
                    Benefits = { "Capital safety" },
                    Risks = { "Low returns" }
                },
                _ => new RiskBenefitDto()
            };
        }
    }
}
