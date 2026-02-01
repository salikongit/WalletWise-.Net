namespace WalletWise.API.Services
{
    public interface IPdfService
    {
        Task<byte[]> GenerateFinancialReportAsync(int userId);
    }
}




