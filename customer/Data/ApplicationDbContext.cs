using Microsoft.EntityFrameworkCore;
using customer.Models;

namespace customer.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        public DbSet<Organizer> Organizers { get; set; }
        public DbSet<EventDetails> EventDetails { get; set; }
        public DbSet<VenueDetails> VenueDetails { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Ensures that when an Event is deleted, its Venue details are also deleted
            modelBuilder.Entity<EventDetails>()
                .HasOne(e => e.Venue)
                .WithOne()
                .HasForeignKey<VenueDetails>(v => v.EventId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}