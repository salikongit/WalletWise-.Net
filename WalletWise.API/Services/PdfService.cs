using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using WalletWise.API.DTOs;
using WalletWise.API.Repositories;

namespace WalletWise.API.Services
{
    public class PdfService : IPdfService
    {
        private readonly IUserRepository _userRepository;
        private readonly IIncomeRepository _incomeRepository;
        private readonly IExpenseRepository _expenseRepository;
        private readonly ILoanRepository _loanRepository;
        private readonly IInvestmentRepository _investmentRepository;
        private readonly IFinancialCalculationService _calculationService;

        public PdfService(
            IUserRepository userRepository,
            IIncomeRepository incomeRepository,
            IExpenseRepository expenseRepository,
            ILoanRepository loanRepository,
            IInvestmentRepository investmentRepository,
            IFinancialCalculationService calculationService)
        {
            _userRepository = userRepository;
            _incomeRepository = incomeRepository;
            _expenseRepository = expenseRepository;
            _loanRepository = loanRepository;
            _investmentRepository = investmentRepository;
            _calculationService = calculationService;

            QuestPDF.Settings.License = LicenseType.Community;
        }

        public async Task<byte[]> GenerateFinancialReportAsync(int userId)
        {
            var user = await _userRepository.GetByIdAsync(userId)
                       ?? throw new Exception("User not found");

            var incomes = (await _incomeRepository.GetByUserIdAsync(userId)).ToList();
            var expenses = (await _expenseRepository.GetByUserIdAsync(userId)).ToList();
            var loans = (await _loanRepository.GetByUserIdAsync(userId)).ToList();

            decimal totalIncome = incomes.Sum(i => i.Amount);
            decimal totalExpense = expenses.Sum(e => e.Amount);
            decimal savings = totalIncome - totalExpense;

            var loanAmortizations = loans.Select(loan =>
            {
                var emi = _calculationService.CalculateEmi(new EmiCalculationDto
                {
                    PrincipalAmount = loan.PrincipalAmount,
                    InterestRate = loan.InterestRate,
                    TenureMonths = loan.TenureMonths
                });

                return new { Loan = loan, Emi = emi };
            }).ToList();

            decimal totalMonthlyEmi = loanAmortizations.Sum(x => x.Emi.EmiAmount);
            decimal savingsAfterEmi = savings - totalMonthlyEmi;

            var document = Document.Create(container =>
            {
                container.Page(page =>
                {
                    page.Size(PageSizes.A4);
                    page.Margin(30);
                    page.DefaultTextStyle(x => x.FontSize(10));

                    // ================= HEADER =================
                    page.Header().Row(row =>
                    {
                        row.RelativeItem().Column(col =>
                        {
                            col.Item().Text("WalletWise")
                                .FontSize(22)
                                .Bold()
                                .FontColor(Colors.Blue.Darken2);

                            col.Item().Text("Personal Finance & Investment Report")
                                .FontSize(10)
                                .FontColor(Colors.Grey.Darken1);
                        });

                        row.ConstantItem(120)
                            .AlignRight()
                            .AlignMiddle()
                            .Text($"Generated: {DateTime.UtcNow:dd MMM yyyy}")
                            .FontSize(9)
                            .FontColor(Colors.Grey.Medium);
                    });

                    // ================= CONTENT =================
                    page.Content().Stack(stack =>
                    {
                        // ✅ WATERMARK (NO OPACITY, SAFE API)
                        stack.Item()
                            .AlignCenter()
                            .AlignMiddle()
                            .Rotate(-45)
                            .Text("WalletWise")
                            .FontSize(80)
                            .SemiBold()
                            .FontColor(Colors.Grey.Lighten3);

                        stack.Item().Column(col =>
                        {
                            col.Spacing(12);

                            col.Item().Text($"Name: {user.FirstName} {user.LastName}").SemiBold();
                            col.Item().Text($"Email: {user.Email}");

                            // ================= SUMMARY =================
                            col.Item().Background(Colors.Grey.Lighten4).Padding(10).Column(s =>
                            {
                                s.Item().Text("Financial Summary").SemiBold().FontSize(13);
                                s.Item().Text($"Total Income: ₹{totalIncome:N2}");
                                s.Item().Text($"Total Expenses: ₹{totalExpense:N2}");
                                s.Item().Text($"Savings: ₹{savings:N2}");
                                s.Item().Text($"Total Monthly EMI: ₹{totalMonthlyEmi:N2}");
                                s.Item().Text($"Savings After EMI: ₹{savingsAfterEmi:N2}")
                                    .SemiBold()
                                    .FontColor(savingsAfterEmi >= 0
                                        ? Colors.Green.Darken1
                                        : Colors.Red.Darken1);
                            });

                            // ================= EMI vs SAVINGS BAR =================
                            col.Item().PaddingTop(10).Text("EMI vs Savings").SemiBold();

                            DrawBar(col, "Monthly EMI", totalMonthlyEmi, Colors.Red.Lighten2,
                                Math.Max(totalMonthlyEmi, savingsAfterEmi));

                            DrawBar(col, "Savings", savingsAfterEmi, Colors.Green.Lighten2,
                                Math.Max(totalMonthlyEmi, savingsAfterEmi));

                            // ================= LOANS =================
                            foreach (var item in loanAmortizations)
                            {
                                col.Item().PaddingTop(12)
                                    .Text($"Loan: {item.Loan.LoanName}")
                                    .SemiBold()
                                    .FontSize(12);

                                col.Item().Text(
                                    $"Principal: ₹{item.Loan.PrincipalAmount:N2} | " +
                                    $"Interest: {item.Loan.InterestRate}% | " +
                                    $"Tenure: {item.Loan.TenureMonths} months | " +
                                    $"EMI: ₹{item.Emi.EmiAmount:N2}");

                                col.Item().Element(c =>
                                    BuildAmortizationTable(c, item.Emi.AmortizationSchedule));
                            }
                        });
                    });

                    // ================= FOOTER =================
                    page.Footer().AlignCenter().Text(t =>
                    {
                        t.Span("WalletWise | Confidential | Page ");
                        t.CurrentPageNumber();
                        t.Span(" / ");
                        t.TotalPages();
                    });
                });
            });

            return document.GeneratePdf();
        }

        // ================= HELPERS =================

        private static void DrawBar(
            ColumnDescriptor col,
            string label,
            decimal value,
            string color,
            decimal max)
        {
            float width = max == 0 ? 0 : (float)((value / max) * 300);

            col.Item().Row(row =>
            {
                row.ConstantItem(120).Text(label).FontSize(9);
                row.ConstantItem(width).Height(12).Background(color);
                row.ConstantItem(80).AlignRight().Text($"₹{value:N0}").FontSize(9);
            });
        }

        private static void BuildAmortizationTable(
            IContainer container,
            List<AmortizationScheduleDto> schedule)
        {
            var rows = schedule.Count <= 15
                ? schedule
                : schedule.Take(12).Concat(schedule.TakeLast(3)).ToList();

            container.Table(table =>
            {
                table.ColumnsDefinition(cols =>
                {
                    cols.ConstantColumn(40);
                    cols.ConstantColumn(80);
                    cols.ConstantColumn(80);
                    cols.ConstantColumn(80);
                    cols.RelativeColumn();
                });

                table.Header(h =>
                {
                    h.Cell().Element(CellHeader).Text("Month");
                    h.Cell().Element(CellHeader).Text("EMI");
                    h.Cell().Element(CellHeader).Text("Principal");
                    h.Cell().Element(CellHeader).Text("Interest");
                    h.Cell().Element(CellHeader).Text("Balance");
                });

                foreach (var r in rows)
                {
                    table.Cell().Element(CellBody).Text(r.Month.ToString());
                    table.Cell().Element(CellBody).Text($"₹{(r.Principal + r.Interest):N2}");
                    table.Cell().Element(CellBody).Text($"₹{r.Principal:N2}");
                    table.Cell().Element(CellBody).Text($"₹{r.Interest:N2}");
                    table.Cell().Element(CellBody).Text($"₹{r.Balance:N2}");
                }
            });
        }

        private static IContainer CellHeader(IContainer c) =>
            c.Padding(5).Background(Colors.Grey.Lighten3).Border(1).AlignCenter();

        private static IContainer CellBody(IContainer c) =>
            c.Padding(5).BorderBottom(1).BorderColor(Colors.Grey.Lighten2);
    }
}
