using BCrypt.Net;

namespace WalletWise.API.Utils
{
    /// <summary>
    /// Utility class to generate BCrypt password hashes
    /// Use this to generate password hashes for the admin user in the database
    /// </summary>
    public static class PasswordHashGenerator
    {
        /// <summary>
        /// Generates a BCrypt hash for the given password
        /// Use this to create the admin user password hash for the database
        /// </summary>
        /// <param name="password">Plain text password</param>
        /// <returns>BCrypt hash string</returns>
        public static string GenerateHash(string password)
        {
            return BCrypt.Net.BCrypt.HashPassword(password);
        }

        /// <summary>
        /// Verifies a password against a BCrypt hash
        /// </summary>
        /// <param name="password">Plain text password</param>
        /// <param name="hash">BCrypt hash</param>
        /// <returns>True if password matches hash</returns>
        public static bool VerifyPassword(string password, string hash)
        {
            return BCrypt.Net.BCrypt.Verify(password, hash);
        }
    }
}




