using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WalletWise.API.Migrations
{
    /// <inheritdoc />
    public partial class AddMonthlyEmiToLoan : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "SelectedInvestmentType",
                table: "UserOnboardingStatuses",
                type: "int",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SelectedInvestmentType",
                table: "UserOnboardingStatuses");
        }
    }
}
