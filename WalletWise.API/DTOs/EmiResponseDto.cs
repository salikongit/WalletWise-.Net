namespace WalletWise.API.DTOs
{
    public class EmiResponseDto
    {
        public decimal EmiAmount { get; set; }
        public decimal TotalAmount { get; set; }
        public decimal TotalInterest { get; set; }
        public List<AmortizationScheduleDto> AmortizationSchedule { get; set; } = new();
    }

    public class AmortizationScheduleDto
    {
        public int Month { get; set; }
        public decimal Principal { get; set; }
        public decimal Interest { get; set; }
        public decimal Balance { get; set; }
    }
}




