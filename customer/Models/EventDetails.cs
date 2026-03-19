using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace customer.Models
{
    [Table("event_details")] // Explicitly naming the table as per your requirement
    public class EventDetails
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        [StringLength(200)]
        public string Title { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        public string EventType { get; set; } = string.Empty; // e.g. Music, Tech, Workshop

        [Required]
        public DateTime DateTime { get; set; }

        [Column(TypeName = "decimal(18, 2)")] // Ensures MySQL handles the currency correctly
        public decimal Price { get; set; }

        public string ImagePath { get; set; } = string.Empty; 

        public int AvailableTickets { get; set; }

        // --- Relationships ---

        // Foreign Key to the Organizer (The Customer)
        [Required]
        public int OrganizerId { get; set; }

        [ForeignKey("OrganizerId")]
        public virtual Organizer Organizer { get; set; } = null!;

        // Relationship to Venue (1-to-1)
        // Note: The Foreign Key is actually defined in the VenueDetails table
        public virtual VenueDetails Venue { get; set; } = null!;
    }
}