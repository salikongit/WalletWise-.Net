using WalletWise.API.DTOs;
using WalletWise.API.Models;
using WalletWise.API.Repositories;

namespace WalletWise.API.Services
{
    public class InvestmentService : IInvestmentService
    {
        private readonly IInvestmentRepository _investmentRepository;
        private readonly IFinancialCalculationService _calculationService;
        private readonly IUserService _userService;

        public InvestmentService(IInvestmentRepository investmentRepository, IFinancialCalculationService calculationService, IUserService userService)
        {
            _investmentRepository = investmentRepository;
            _calculationService = calculationService;
            _userService = userService;
        }

        public async Task<InvestmentDto> CreateInvestmentAsync(int userId, InvestmentDto investmentDto)
        {
            // Check available investment amount after EMI deduction
            var dashboard = await _userService.GetDashboardAsync(userId);
            if (investmentDto.PrincipalAmount > dashboard.AvailableForInvestment)
            {
                throw new InvalidOperationException($"Investment amount ₹{investmentDto.PrincipalAmount:N2} exceeds available amount ₹{dashboard.AvailableForInvestment:N2} after EMI deduction.");
            }

            // InvestmentType is now an enum, validation happens at model level

            var invCalc = _calculationService.CalculateInvestment(new InvestmentCalculationDto
            {
                InvestmentType = investmentDto.InvestmentType,
                PrincipalAmount = investmentDto.PrincipalAmount,
                ExpectedReturnRate = investmentDto.ExpectedReturnRate,
                InvestmentPeriodYears = investmentDto.InvestmentPeriodYears
            });

            var investment = new Investment
            {
                UserId = userId,
                InvestmentName = investmentDto.InvestmentName,
                InvestmentType = investmentDto.InvestmentType,
                PrincipalAmount = investmentDto.PrincipalAmount,
                ExpectedReturnRate = investmentDto.ExpectedReturnRate,
                InvestmentPeriodYears = investmentDto.InvestmentPeriodYears,
                ExpectedFutureValue = invCalc.FutureValue,
                CreatedAt = DateTime.UtcNow
            };

            var created = await _investmentRepository.CreateAsync(investment);

            return new InvestmentDto
            {
                InvestmentId = created.InvestmentId,
                InvestmentName = created.InvestmentName,
                InvestmentType = created.InvestmentType,
                PrincipalAmount = created.PrincipalAmount,
                ExpectedReturnRate = created.ExpectedReturnRate,
                InvestmentPeriodYears = created.InvestmentPeriodYears
            };
        }

        public async Task<List<InvestmentDto>> GetUserInvestmentsAsync(int userId)
        {
            var investments = await _investmentRepository.GetByUserIdAsync(userId);
            return investments.Select(i => new InvestmentDto
            {
                InvestmentId = i.InvestmentId,
                InvestmentName = i.InvestmentName,
                InvestmentType = i.InvestmentType,
                PrincipalAmount = i.PrincipalAmount,
                ExpectedReturnRate = i.ExpectedReturnRate,
                InvestmentPeriodYears = i.InvestmentPeriodYears
            }).ToList();
        }

        public async Task<InvestmentDto?> GetInvestmentByIdAsync(int investmentId, int userId)
        {
            var investment = await _investmentRepository.GetByIdAsync(investmentId);
            if (investment == null || investment.UserId != userId)
            {
                return null;
            }

            return new InvestmentDto
            {
                InvestmentId = investment.InvestmentId,
                InvestmentName = investment.InvestmentName,
                InvestmentType = investment.InvestmentType,
                PrincipalAmount = investment.PrincipalAmount,
                ExpectedReturnRate = investment.ExpectedReturnRate,
                InvestmentPeriodYears = investment.InvestmentPeriodYears
            };
        }

        public async Task<InvestmentDto> UpdateInvestmentAsync(int investmentId, int userId, InvestmentDto investmentDto)
        {
            var investment = await _investmentRepository.GetByIdAsync(investmentId);
            if (investment == null || investment.UserId != userId)
            {
                throw new UnauthorizedAccessException("Investment not found or access denied");
            }

            var invCalc = _calculationService.CalculateInvestment(new InvestmentCalculationDto
            {
                InvestmentType = investmentDto.InvestmentType,
                PrincipalAmount = investmentDto.PrincipalAmount,
                ExpectedReturnRate = investmentDto.ExpectedReturnRate,
                InvestmentPeriodYears = investmentDto.InvestmentPeriodYears
            });

            investment.InvestmentName = investmentDto.InvestmentName;
            investment.InvestmentType = investmentDto.InvestmentType;
            investment.PrincipalAmount = investmentDto.PrincipalAmount;
            investment.ExpectedReturnRate = investmentDto.ExpectedReturnRate;
            investment.InvestmentPeriodYears = investmentDto.InvestmentPeriodYears;
            investment.ExpectedFutureValue = invCalc.FutureValue;
            investment.UpdatedAt = DateTime.UtcNow;

            var updated = await _investmentRepository.UpdateAsync(investment);

            return new InvestmentDto
            {
                InvestmentId = updated.InvestmentId,
                InvestmentName = updated.InvestmentName,
                InvestmentType = updated.InvestmentType,
                PrincipalAmount = updated.PrincipalAmount,
                ExpectedReturnRate = updated.ExpectedReturnRate,
                InvestmentPeriodYears = updated.InvestmentPeriodYears
            };
        }

        public async Task<bool> DeleteInvestmentAsync(int investmentId, int userId)
        {
            var investment = await _investmentRepository.GetByIdAsync(investmentId);
            if (investment == null || investment.UserId != userId)
            {
                return false;
            }

            return await _investmentRepository.DeleteAsync(investmentId);
        }
    }
}



