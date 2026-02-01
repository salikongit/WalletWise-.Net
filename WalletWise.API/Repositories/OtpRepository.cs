using Microsoft.EntityFrameworkCore;
using WalletWise.API.Data;
using WalletWise.API.Models;

namespace WalletWise.API.Repositories
{
    public class OtpRepository : IOtpRepository
    {
        private readonly WalletWiseDbContext _context;

        public OtpRepository(WalletWiseDbContext context)
        {
            _context = context;
        }

        public async Task<Otp> CreateAsync(Otp otp)
        {
            _context.Otps.Add(otp);
            await _context.SaveChangesAsync();
            return otp;
        }

        public async Task<Otp?> GetLatestOtpByUserIdAsync(int userId)
        {
            return await _context.Otps
                .Where(o => o.UserId == userId && !o.IsUsed)
                .OrderByDescending(o => o.CreatedAt)
                .FirstOrDefaultAsync();
        }

        public async Task MarkAsUsedAsync(int otpId)
        {
            var otp = await _context.Otps.FindAsync(otpId);
            if (otp != null)
            {
                otp.IsUsed = true;
                await _context.SaveChangesAsync();
            }
        }
    }
}




