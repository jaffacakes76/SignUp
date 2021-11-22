using Microsoft.EntityFrameworkCore;

namespace SignUp_BE.Models
{
    public class SignUpContext : DbContext
    {
        public DbSet<Company> Companies { get; set; }
        public DbSet<JobAd> JobAds { get; set; }
        public DbSet<User> Users { get; set; }

        public SignUpContext(DbContextOptions options) : base(options)
        {
            
        }       
    }
}
