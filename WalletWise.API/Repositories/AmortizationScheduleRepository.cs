using Microsoft.EntityFrameworkCore;
using WalletWise.API.Data;
using WalletWise.API.Models;

namespace WalletWise.API.Repositories
{
    public class AmortizationScheduleRepository : IAmortizationScheduleRepository
    {
        private readonly WalletWiseDbContext _context;

        public AmortizationScheduleRepository(WalletWiseDbContext context)
        {
            _context = context;
        }

        public async Task<List<AmortizationSchedule>> GetByLoanIdAsync(int loanId)
        {
            return await _context.AmortizationSchedules
                .Where(a => a.LoanId == loanId)
                .OrderBy(a => a.Month)
                .ToListAsync();
        }

        public async Task<AmortizationSchedule> CreateAsync(AmortizationSchedule schedule)
        {
            _context.AmortizationSchedules.Add(schedule);
            await _context.SaveChangesAsync();
            return schedule;
        }

        public async Task<bool> DeleteByLoanIdAsync(int loanId)
        {
            var schedules = await _context.AmortizationSchedules
                .Where(a => a.LoanId == loanId)
                .ToListAsync();

            if (schedules.Any())
            {
                _context.AmortizationSchedules.RemoveRange(schedules);
                await _context.SaveChangesAsync();
            }

            return true;
        }

        public async Task<bool> CreateBatchAsync(List<AmortizationSchedule> schedules)
        {
            _context.AmortizationSchedules.AddRange(schedules);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}



