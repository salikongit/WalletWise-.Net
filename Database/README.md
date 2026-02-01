# Database Setup Guide

## SQL Server LocalDB

This project uses **SQL Server LocalDB** which is included with Visual Studio.

### Connection String

The default connection string in `appsettings.json`:
```
Server=(localdb)\mssqllocaldb;Database=WalletWiseDB;Trusted_Connection=true;MultipleActiveResultSets=true
```

### Setup Methods

#### Method 1: Using SQL Server Management Studio (SSMS)

1. **Install SSMS** (if not already installed):
   - Download from: https://docs.microsoft.com/en-us/sql/ssms/download-sql-server-management-studio-ssms

2. **Connect to LocalDB**:
   - Server name: `(localdb)\mssqllocaldb`
   - Authentication: Windows Authentication

3. **Run Schema Script**:
   - Open `Database/Schema.sql`
   - Execute the entire script in SSMS

#### Method 2: Using Visual Studio

1. **Open SQL Server Object Explorer**:
   - View → SQL Server Object Explorer

2. **Connect to LocalDB**:
   - Right-click "SQL Server" → Add SQL Server
   - Server name: `(localdb)\mssqllocaldb`
   - Authentication: Windows Authentication

3. **Run Schema Script**:
   - Right-click on `WalletWiseDB` → New Query
   - Copy and paste contents of `Schema.sql`
   - Execute

#### Method 3: Using Entity Framework Migrations

```bash
cd WalletWise.API
dotnet ef migrations add InitialCreate
dotnet ef database update
```

**Note:** This method requires the schema to be defined in Entity Framework models (which is already done).

### Verify Installation

After running the schema, verify the tables were created:

```sql
USE WalletWiseDB;
GO
SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE';
GO
```

You should see:
- Users
- UserRoles
- OTPs
- Loans
- AmortizationSchedules
- Investments
- Incomes
- Expenses
- UserFinancialProfiles
- UserOnboardingStatuses

### Default Admin User

After running the schema, you can login with:
- **Email**: `admin@walletwise.com`
- **Password**: `Admin@123`

**⚠️ Change this password in production!**

### Troubleshooting

**Issue: Cannot connect to LocalDB**
- Ensure SQL Server LocalDB is installed
- Check if LocalDB instance is running: `sqllocaldb info mssqllocaldb`
- Start LocalDB: `sqllocaldb start mssqllocaldb`

**Issue: Database already exists**
- The schema script checks for existing tables
- Safe to run multiple times
- If you need to recreate, drop the database first:
  ```sql
  DROP DATABASE WalletWiseDB;
  ```

**Issue: Trusted Connection fails**
- Ensure you're running Visual Studio/SSMS as the same Windows user
- LocalDB uses Windows Authentication only



