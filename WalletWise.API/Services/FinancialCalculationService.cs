using WalletWise.API.DTOs;

namespace WalletWise.API.Services
{
    public class FinancialCalculationService : IFinancialCalculationService
    {
        public EmiResponseDto CalculateEmi(EmiCalculationDto request)
        {
            // Convert annual interest rate to monthly
            var monthlyRate = (request.InterestRate / 100) / 12;
            var principal = request.PrincipalAmount;
            var tenure = request.TenureMonths;

            // EMI Formula: [P × R × (1+R)^N] / [(1+R)^N − 1]
            var emi = 0m;
            if (monthlyRate > 0)
            {
                var power = (decimal)Math.Pow((double)(1 + monthlyRate), tenure);
                emi = principal * monthlyRate * power / (power - 1);
            }
            else
            {
                emi = principal / tenure;
            }

            var totalAmount = emi * tenure;
            var totalInterest = totalAmount - principal;

            // Generate Amortization Schedule
            var schedule = new List<AmortizationScheduleDto>();
            var balance = principal;

            for (int month = 1; month <= tenure; month++)
            {
                var interest = balance * monthlyRate;
                var principalPayment = emi - interest;
                balance -= principalPayment;

                schedule.Add(new AmortizationScheduleDto
                {
                    Month = month,
                    Principal = Math.Round(principalPayment, 2),
                    Interest = Math.Round(interest, 2),
                    Balance = Math.Round(Math.Max(0, balance), 2)
                });
            }

            return new EmiResponseDto
            {
                EmiAmount = Math.Round(emi, 2),
                TotalAmount = Math.Round(totalAmount, 2),
                TotalInterest = Math.Round(totalInterest, 2),
                AmortizationSchedule = schedule
            };
        }

        public InvestmentResponseDto CalculateInvestment(InvestmentCalculationDto request)
        {
            var principal = request.PrincipalAmount;
            var annualRate = request.ExpectedReturnRate / 100;
            var years = request.InvestmentPeriodYears;

            decimal futureValue;
            decimal totalInvestment;
            decimal totalReturns;

            if (request.InvestmentType.ToString().ToUpper() == "SIP")
            {
                // SIP Formula: FV = P × [((1+r)^n − 1) / r] × (1+r)
                // Where P is monthly payment, r is monthly rate, n is number of months
                var monthlyRate = annualRate / 12;
                var months = years * 12;

                if (monthlyRate > 0)
                {
                    var power = (decimal)Math.Pow((double)(1 + monthlyRate), months);
                    futureValue = principal * ((power - 1) / monthlyRate) * (1 + monthlyRate);
                }
                else
                {
                    futureValue = principal * months;
                }

                totalInvestment = principal * months;
            }
            else // Lumpsum
            {
                // Lumpsum Formula: FV = P × (1+r)^n
                futureValue = principal * (decimal)Math.Pow((double)(1 + annualRate), years);
                totalInvestment = principal;
            }

            totalReturns = futureValue - totalInvestment;

            return new InvestmentResponseDto
            {
                FutureValue = Math.Round(futureValue, 2),
                TotalInvestment = Math.Round(totalInvestment, 2),
                TotalReturns = Math.Round(totalReturns, 2),
                InvestmentType = request.InvestmentType
            };
        }
    }
}




