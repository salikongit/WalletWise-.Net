using WalletWise.API.DTOs;
using WalletWise.API.Models;
using WalletWise.API.Repositories;

namespace WalletWise.API.Services
{
    public class LoanService : ILoanService
    {
        private readonly ILoanRepository _loanRepository;
        private readonly IFinancialCalculationService _calculationService;

        public LoanService(ILoanRepository loanRepository, IFinancialCalculationService calculationService)
        {
            _loanRepository = loanRepository;
            _calculationService = calculationService;
        }

        public async Task<LoanDto> CreateLoanAsync(int userId, LoanDto loanDto)
        {
            var emiCalc = _calculationService.CalculateEmi(new EmiCalculationDto
            {
                PrincipalAmount = loanDto.PrincipalAmount,
                InterestRate = loanDto.InterestRate,
                TenureMonths = loanDto.TenureMonths
            });

            var loan = new Loan
            {
                UserId = userId,
                LoanName = loanDto.LoanName,
                PrincipalAmount = loanDto.PrincipalAmount,
                InterestRate = loanDto.InterestRate,
                TenureMonths = loanDto.TenureMonths,
                EmiAmount = emiCalc.EmiAmount,
                CreatedAt = DateTime.UtcNow
            };

            var created = await _loanRepository.CreateAsync(loan);

            return new LoanDto
            {
                LoanId = created.LoanId,
                LoanName = created.LoanName,
                PrincipalAmount = created.PrincipalAmount,
                InterestRate = created.InterestRate,
                TenureMonths = created.TenureMonths,
                EmiAmount = created.EmiAmount
            };
        }

        public async Task<List<LoanDto>> GetUserLoansAsync(int userId)
        {
            var loans = await _loanRepository.GetByUserIdAsync(userId);
            return loans.Select(l => new LoanDto
            {
                LoanId = l.LoanId,
                LoanName = l.LoanName,
                PrincipalAmount = l.PrincipalAmount,
                InterestRate = l.InterestRate,
                TenureMonths = l.TenureMonths,
                EmiAmount = l.EmiAmount
            }).ToList();
        }

        public async Task<LoanDto?> GetLoanByIdAsync(int loanId, int userId)
        {
            var loan = await _loanRepository.GetByIdAsync(loanId);
            if (loan == null || loan.UserId != userId)
            {
                return null;
            }

            return new LoanDto
            {
                LoanId = loan.LoanId,
                LoanName = loan.LoanName,
                PrincipalAmount = loan.PrincipalAmount,
                InterestRate = loan.InterestRate,
                TenureMonths = loan.TenureMonths,
                EmiAmount = loan.EmiAmount
            };
        }

        public async Task<LoanDto> UpdateLoanAsync(int loanId, int userId, LoanDto loanDto)
        {
            var loan = await _loanRepository.GetByIdAsync(loanId);
            if (loan == null || loan.UserId != userId)
            {
                throw new UnauthorizedAccessException("Loan not found or access denied");
            }

            var emiCalc = _calculationService.CalculateEmi(new EmiCalculationDto
            {
                PrincipalAmount = loanDto.PrincipalAmount,
                InterestRate = loanDto.InterestRate,
                TenureMonths = loanDto.TenureMonths
            });

            loan.LoanName = loanDto.LoanName;
            loan.PrincipalAmount = loanDto.PrincipalAmount;
            loan.InterestRate = loanDto.InterestRate;
            loan.TenureMonths = loanDto.TenureMonths;
            loan.EmiAmount = emiCalc.EmiAmount;
            loan.UpdatedAt = DateTime.UtcNow;

            var updated = await _loanRepository.UpdateAsync(loan);

            return new LoanDto
            {
                LoanId = updated.LoanId,
                LoanName = updated.LoanName,
                PrincipalAmount = updated.PrincipalAmount,
                InterestRate = updated.InterestRate,
                TenureMonths = updated.TenureMonths,
                EmiAmount = updated.EmiAmount
            };
        }

        public async Task<bool> DeleteLoanAsync(int loanId, int userId)
        {
            var loan = await _loanRepository.GetByIdAsync(loanId);
            if (loan == null || loan.UserId != userId)
            {
                return false;
            }

            return await _loanRepository.DeleteAsync(loanId);
        }

        public async Task<EmiResponseDto> GetLoanAmortizationAsync(int loanId, int userId)
        {
            var loan = await _loanRepository.GetByIdAsync(loanId);
            if (loan == null || loan.UserId != userId)
            {
                throw new UnauthorizedAccessException("Loan not found or access denied");
            }

            return _calculationService.CalculateEmi(new EmiCalculationDto
            {
                PrincipalAmount = loan.PrincipalAmount,
                InterestRate = loan.InterestRate,
                TenureMonths = loan.TenureMonths

            });
        }
    }
}




