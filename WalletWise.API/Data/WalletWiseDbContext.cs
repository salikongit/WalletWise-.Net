using Microsoft.EntityFrameworkCore;
using WalletWise.API.Models;

namespace WalletWise.API.Data
{
    public class WalletWiseDbContext : DbContext
    {
        public WalletWiseDbContext(DbContextOptions<WalletWiseDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<UserRole> UserRoles { get; set; }
        public DbSet<Otp> Otps { get; set; }
        public DbSet<Loan> Loans { get; set; }
        public DbSet<AmortizationSchedule> AmortizationSchedules { get; set; }
        public DbSet<Investment> Investments { get; set; }
        public DbSet<Income> Incomes { get; set; }
        public DbSet<Expense> Expenses { get; set; }
        public DbSet<FinancialProfile> FinancialProfiles { get; set; }
        public DbSet<UserOnboardingStatus> UserOnboardingStatuses { get; set; }
        public DbSet<EquityStock> EquityStocks { get; set; }
        public DbSet<SipFund> SipFunds { get; set; }
        public DbSet<FixedDeposit> FixedDeposits { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // User configuration
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasIndex(e => e.Email).IsUnique();
            });

            // UserRole configuration
            modelBuilder.Entity<UserRole>(entity =>
            {
                entity.HasOne(ur => ur.User)
                      .WithMany(u => u.UserRoles)
                      .HasForeignKey(ur => ur.UserId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            // OTP configuration
            modelBuilder.Entity<Otp>(entity =>
            {
                entity.HasOne(o => o.User)
                      .WithMany()
                      .HasForeignKey(o => o.UserId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            // Loan configuration
            modelBuilder.Entity<Loan>(entity =>
            {
                entity.HasOne(l => l.User)
                      .WithMany(u => u.Loans)
                      .HasForeignKey(l => l.UserId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            // AmortizationSchedule configuration
            modelBuilder.Entity<AmortizationSchedule>(entity =>
            {
                entity.HasOne(a => a.Loan)
                      .WithMany(l => l.AmortizationSchedules)
                      .HasForeignKey(a => a.LoanId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            // UserOnboardingStatus configuration
            modelBuilder.Entity<UserOnboardingStatus>(entity =>
            {
                entity.HasKey(e => e.StatusId); // ✅ EXPLICIT KEY

                entity.HasOne(e => e.User)
                      .WithMany()
                      .HasForeignKey(e => e.UserId)
                      .OnDelete(DeleteBehavior.Cascade);
            });


            // Investment configuration
            modelBuilder.Entity<Investment>(entity =>
            {
                entity.HasOne(i => i.User)
                      .WithMany(u => u.Investments)
                      .HasForeignKey(i => i.UserId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            // Income configuration
            modelBuilder.Entity<Income>(entity =>
            {
                entity.HasOne(i => i.User)
                      .WithMany(u => u.Incomes)
                      .HasForeignKey(i => i.UserId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            // Expense configuration
            modelBuilder.Entity<Expense>(entity =>
            {
                entity.HasOne(e => e.User)
                      .WithMany(u => u.Expenses)
                      .HasForeignKey(e => e.UserId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            // FinancialProfile configuration
            modelBuilder.Entity<FinancialProfile>(entity =>
            {
                entity.HasOne(fp => fp.User)
                      .WithOne(u => u.FinancialProfile)
                      .HasForeignKey<FinancialProfile>(fp => fp.UserId)
                      .OnDelete(DeleteBehavior.Cascade);

                entity.HasIndex(e => e.UserId).IsUnique();
            });
            modelBuilder.Entity<EquityStock>(entity =>
            {
                entity.Property(e => e.CurrentPrice).HasPrecision(18, 2);
                entity.Property(e => e.PreviousClose).HasPrecision(18, 2);
                entity.Property(e => e.ChangePercent).HasPrecision(5, 2);
                entity.Property(e => e.MinInvestment).HasPrecision(18, 2);
                entity.Property(e => e.MaxInvestment).HasPrecision(18, 2);
            });
            modelBuilder.Entity<SipFund>(entity =>
            {
                entity.Property(e => e.Nav).HasPrecision(18, 2);
                entity.Property(e => e.ExpectedReturn).HasPrecision(6, 2);
                entity.Property(e => e.MinMonthlyAmount).HasPrecision(18, 2);
                entity.Property(e => e.MaxMonthlyAmount).HasPrecision(18, 2);
            });

            modelBuilder.Entity<FixedDeposit>(entity =>
            {
                entity.Property(e => e.InterestRate).HasPrecision(5, 2);
                entity.Property(e => e.MinInvestment).HasPrecision(18, 2);
                entity.Property(e => e.MaxInvestment).HasPrecision(18, 2);
            });

            // ====== SEED DATA LAST ======

            modelBuilder.Entity<EquityStock>().HasData(
                new EquityStock
                {
                    Id = 1,
                    Symbol = "TCS",
                    CompanyName = "Tata Consultancy Services",
                    CurrentPrice = 3850,
                    PreviousClose = 3800,
                    ChangePercent = 1.31m,
                    Volume = 1200000,
                    RiskLevel = "Medium",
                    MinInvestment = 3850,
                    MaxInvestment = 50000,
                    IsActive = true,
                    LastUpdated = new DateTime(2026, 01, 01)

                },
                new EquityStock
                {
                    Id = 2,
                    Symbol = "INFY",
                    CompanyName = "Infosys Ltd",
                    CurrentPrice = 1520,
                    PreviousClose = 1500,
                    ChangePercent = 1.33m,
                    Volume = 980000,
                    RiskLevel = "Medium",
                    MinInvestment = 1520,
                    MaxInvestment = 40000,
                    IsActive = true,
                    LastUpdated = new DateTime(2026, 01, 01)

                }
            );


            // (SipFund + FixedDeposit seed continues)


            modelBuilder.Entity<SipFund>().HasData(
                new SipFund
                {
                    Id = 1,
                    FundCode = "SIP-LC-01",
                    FundName = "Large Cap Equity Fund",
                    Category = "Large Cap",
                    Nav = 120.5m,
                    ExpectedReturn = 12.0m,
                    RiskLevel = "Medium",
                    MinMonthlyAmount = 500,
                    MaxMonthlyAmount = 20000,
                    LockInYears = 3,
                    IsActive = true
                },
                new SipFund
                {
                    Id = 2,
                    FundCode = "SIP-MC-01",
                    FundName = "Mid Cap Equity Fund",
                    Category = "Mid Cap",
                    Nav = 95.2m,
                    ExpectedReturn = 14.0m,
                    RiskLevel = "High",
                    MinMonthlyAmount = 500,
                    MaxMonthlyAmount = 15000,
                    LockInYears = 3,
                    IsActive = true
                }
            );

            modelBuilder.Entity<FixedDeposit>().HasData(
                new FixedDeposit
                {
                    Id = 1,
                    BankName = "SBI",
                    TenureYears = 1,
                    InterestRate = 6.5m,
                    MinInvestment = 1000,
                    MaxInvestment = 100000,
                    IsActive = true
                },
                new FixedDeposit
                {
                    Id = 2,
                    BankName = "HDFC",
                    TenureYears = 3,
                    InterestRate = 7.0m,
                    MinInvestment = 1000,
                    MaxInvestment = 200000,
                    IsActive = true
                }
            );

        }
    }
}


