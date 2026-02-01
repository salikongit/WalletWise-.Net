using WalletWise.API.Models;

namespace WalletWise.API.Repositories
{
    public interface IAmortizationScheduleRepository
    {
        Task<List<AmortizationSchedule>> GetByLoanIdAsync(int loanId);
        Task<AmortizationSchedule> CreateAsync(AmortizationSchedule schedule);
        Task<bool> DeleteByLoanIdAsync(int loanId);
        Task<bool> CreateBatchAsync(List<AmortizationSchedule> schedules);
    }
}



