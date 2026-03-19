using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;

namespace customer.Models
{
    public class Organizer
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string Password { get; set; } = string.Empty;

        public string CompanyName { get; set; } = string.Empty;

        // Relationship: One Organizer can have many Events
        public virtual ICollection<EventDetails> Events { get; set; } = new List<EventDetails>();
    }
}