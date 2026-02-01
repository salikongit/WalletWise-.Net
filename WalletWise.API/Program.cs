using Amazon.SimpleEmail;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;
using WalletWise.API.Data;
using WalletWise.API.Middleware;
using WalletWise.API.Repositories;
using WalletWise.API.Services;
using WalletWise.API.Services.MarketData;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


builder.Services.AddSingleton<YahooFinanceService>();

/* -----------------------------------------------------------
   📌 CORS (Allow Frontend)
------------------------------------------------------------ */
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact", policy =>
    {
        policy.WithOrigins("http://localhost:3000", "https://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

/* -----------------------------------------------------------
   📌 Swagger + JWT
------------------------------------------------------------ */
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "WalletWise API",
        Version = "v1",
        Description = "CDAC Major Project - Personal Finance Platform"
    });

    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header,
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer",
        Description = "Enter: Bearer {your_token}"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement {
        {
            new OpenApiSecurityScheme {
                    Reference = new OpenApiReference {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

/* -----------------------------------------------------------
   📌 DB + JWT
------------------------------------------------------------ */
builder.Services.AddDbContext<WalletWiseDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"))
);

var jwt = builder.Configuration.GetSection("JwtSettings");

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwt["Issuer"],
        ValidAudience = jwt["Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwt["SecretKey"]!))
    };
});
builder.Services.AddHttpClient<StockService>(client =>
{
    client.BaseAddress = new Uri("https://query1.finance.yahoo.com/v8/finance/chart/");
    client.Timeout = TimeSpan.FromSeconds(10);

    // 🔥 THIS IS CRITICAL – Yahoo blocks requests without it
    client.DefaultRequestHeaders.Add(
        "User-Agent",
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
    );
});


builder.Services.AddAuthorization();


/* -----------------------------------------------------------
   📌 Repository + Service DI
------------------------------------------------------------ */
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IOtpRepository, OtpRepository>();
builder.Services.AddScoped<ILoanRepository, LoanRepository>();
builder.Services.AddScoped<IAmortizationScheduleRepository, AmortizationScheduleRepository>();
builder.Services.AddScoped<IInvestmentRepository, InvestmentRepository>();
builder.Services.AddScoped<IIncomeRepository, IncomeRepository>();
builder.Services.AddScoped<IExpenseRepository, ExpenseRepository>();
builder.Services.AddScoped<IFinancialProfileRepository, FinancialProfileRepository>();
builder.Services.AddScoped<IUserOnboardingStatusRepository, UserOnboardingStatusRepository>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IOtpService, OtpService>();
builder.Services.AddScoped<IJwtService, JwtService>();
builder.Services.AddScoped<IFinancialCalculationService, FinancialCalculationService>();
builder.Services.AddScoped<IStockService, StockService>();
builder.Services.AddScoped<IOnboardingService, OnboardingService>();
builder.Services.AddScoped<IPdfService, PdfService>();
builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<ILoanService, LoanService>();
builder.Services.AddScoped<IInvestmentService, InvestmentService>();
builder.Services.AddScoped<ITransactionService, TransactionService>();
builder.Services.AddScoped<IAdminService, AdminService>();
builder.Services.AddScoped<IMarketDataService, MarketDataService>();

builder.Services.AddScoped<IRecommendationService, RecommendationService>();
builder.Services.AddScoped<IInvestmentProductService, InvestmentProductService>();
builder.Services.AddScoped<IInvestmentSuggestionService, InvestmentSuggestionService>();



var app = builder.Build();

/* -----------------------------------------------------------
   📌 Swagger Only In Dev
------------------------------------------------------------ */
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "WalletWise API v1");
        // 🔥 Remove RoutePrefix so Swagger is accessible at /swagger
        // c.RoutePrefix = string.Empty; ❌ REMOVE THIS
    });
}

/* -----------------------------------------------------------
   📌 HTTPS & Middleware Order (IMPORTANT)
------------------------------------------------------------ */
app.UseHttpsRedirection();
app.UseCors("AllowReact");
app.UseMiddleware<ExceptionHandlingMiddleware>();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.Run();
