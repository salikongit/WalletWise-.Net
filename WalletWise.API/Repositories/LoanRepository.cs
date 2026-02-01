using Microsoft.EntityFrameworkCore;
using WalletWise.API.Data;
using WalletWise.API.Models;

namespace WalletWise.API.Repositories
{
    public class LoanRepository : ILoanRepository
    {
        private readonly WalletWiseDbContext _context;

        public LoanRepository(WalletWiseDbContext context)
        {
            _context = context;
        }

        public async Task<Loan> CreateAsync(Loan loan)
        {
            _context.Loans.Add(loan);
            await _context.SaveChangesAsync();
            return loan;
        }

        public async Task<Loan?> GetByIdAsync(int loanId)
        {
            return await _context.Loans.FindAsync(loanId);
        }

        public async Task<List<Loan>> GetByUserIdAsync(int userId)
        {
            return await _context.Loans
                .Where(l => l.UserId == userId)
                .OrderByDescending(l => l.CreatedAt)
                .ToListAsync();
        }

        public async Task<Loan> UpdateAsync(Loan loan)
        {
            loan.UpdatedAt = DateTime.UtcNow;
            _context.Loans.Update(loan);
            await _context.SaveChangesAsync();
            return loan;
        }

        public async Task<bool> DeleteAsync(int loanId)
        {
            var loan = await _context.Loans.FindAsync(loanId);
            if (loan == null) return false;

            _context.Loans.Remove(loan);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<List<Loan>> GetAllLoansAsync()
        {
            return await _context.Loans.ToListAsync();
        }
    }
}




