using WalletWise.API.DTOs;

namespace WalletWise.API.Services
{
    public interface IFinancialCalculationService
    {
        EmiResponseDto CalculateEmi(EmiCalculationDto request);
        InvestmentResponseDto CalculateInvestment(InvestmentCalculationDto request);
    }
}




