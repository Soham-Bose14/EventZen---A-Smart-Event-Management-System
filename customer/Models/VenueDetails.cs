using System.ComponentModel.DataAnnotations;

namespace customer.Models
{
    public class VenueDetails
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string City { get; set; } = string.Empty;
        [Required]
        public string Venue { get; set; } = string.Empty;
        [Required]
        public string Address { get; set; } = string.Empty;

        // Navigation property back to Event
        public int EventId { get; set; }
    }
}