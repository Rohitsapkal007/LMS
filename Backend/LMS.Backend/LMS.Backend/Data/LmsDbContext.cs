using Microsoft.EntityFrameworkCore;
using LMS.Backend.Models.Domain;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using LMS.Backend.Models.Audit;

namespace LMS.Backend.Data
{
    public class LmsDbContext : IdentityDbContext<User, IdentityRole<int>, int>
    {
        public LmsDbContext(DbContextOptions<LmsDbContext> options) : base(options) { }

        public DbSet<User> users { get; set; }
        public DbSet<Course> courses { get; set; }
        public DbSet<GeneralAudit> generalAudit { get; set; }
        public DbSet<Enrollment> enrollments { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Enrollment>()
                .HasOne(e => e.User)
                .WithMany(u => u.Enrollment)
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Restrict); // prevent cascade

            modelBuilder.Entity<Enrollment>()
                .HasOne(e => e.Course)
                .WithMany(c => c.Enrollment)
                .HasForeignKey(e => e.CourseId)
                .OnDelete(DeleteBehavior.Restrict); // prevent cascade
        }
    }
}
