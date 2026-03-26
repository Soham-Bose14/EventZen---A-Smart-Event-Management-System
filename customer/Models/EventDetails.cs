using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace customer.Models
{
    [Table("event_details")] 
    public class EventDetails
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        [StringLength(200)]
        public string Title { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        public string EventType { get; set; } = string.Empty;

        [Required]
        public DateTime DateTime { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal Price { get; set; }

        public string ImagePath { get; set; } = string.Empty;

        public int AvailableTickets { get; set; }

        [Column("TotalTickets")]
        public int TotalTickets { get; set; }

        // NEW → Approval workflow
        public string Status { get; set; } = "Pending";

        // Relationships
        [Required]
        public int OrganizerId { get; set; }

        [ForeignKey("OrganizerId")]
        public virtual Organizer Organizer { get; set; } = null!;

        public virtual VenueDetails Venue { get; set; } = null!;
    }
}