using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using customer.Data;
using customer.Models;

namespace customer.Controllers
{
    // --- Data Transfer Objects (DTOs) ---
    public class LoginRequest 
    { 
        public string Email { get; set; } = string.Empty; 
        public string Password { get; set; } = string.Empty;
    }

    public class EventCreateDto 
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string EventType { get; set; } = string.Empty;
        public DateTime DateTime { get; set; }
        public decimal Price { get; set; }
        public string ImagePath { get; set; } = string.Empty;
        public int AvailableTickets { get; set; }
        
        // Venue specific fields
        public string City { get; set; } = string.Empty;
        public string VenueName { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
    }

    [ApiController]
    [Route("api/[controller]")]
    public class CustomerController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CustomerController(ApplicationDbContext context)
        {
            _context = context;
        }

        // 1. REGISTER CUSTOMER
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] Organizer customer)
        {
            try
            {
                if (await _context.Organizers.AnyAsync(o => o.Email == customer.Email))
                {
                    return BadRequest(new { message = "Registration failed", error = "Email already registered." });
                }

                var newOrganizer = new Organizer
                {
                    Name = customer.Name,
                    Email = customer.Email,
                    Password = customer.Password,
                    CompanyName = customer.CompanyName
                };

                _context.Organizers.Add(newOrganizer);
                await _context.SaveChangesAsync();
                
                return Ok(new { 
                    id = newOrganizer.Id, 
                    name = newOrganizer.Name, 
                    email = newOrganizer.Email 
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.InnerException?.Message ?? ex.Message);
                return BadRequest(new { message = "Registration failed", error = ex.Message });
            }
        }

        // 2. LOGIN CUSTOMER
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var customer = await _context.Organizers
                .FirstOrDefaultAsync(o => o.Email == request.Email && o.Password == request.Password);

            if (customer == null) 
                return Unauthorized(new { message = "Invalid email or password" });

            return Ok(customer);
        }

        // 3. CREATE EVENT
        [HttpPost("{organizerId}/create-event")]
        public async Task<IActionResult> CreateEvent(int organizerId, [FromBody] EventCreateDto dto)
        {
            var strategy = _context.Database.CreateExecutionStrategy();
            IActionResult finalResult = BadRequest(new { message = "An unexpected error occurred." });

            await strategy.ExecuteAsync(async () =>
            {
                using var transaction = await _context.Database.BeginTransactionAsync();
                try
                {
                    var newEvent = new EventDetails
                    {
                        Title = dto.Title,
                        Description = dto.Description,
                        EventType = dto.EventType,
                        DateTime = dto.DateTime,
                        Price = dto.Price,
                        ImagePath = dto.ImagePath,
                        AvailableTickets = dto.AvailableTickets,
                        OrganizerId = organizerId
                    };

                    _context.EventDetails.Add(newEvent);
                    await _context.SaveChangesAsync(); 

                    var venue = new VenueDetails
                    {
                        City = dto.City,
                        Venue = dto.VenueName, 
                        Address = dto.Address,
                        EventId = newEvent.Id
                    };

                    _context.VenueDetails.Add(venue);
                    await _context.SaveChangesAsync();

                    await transaction.CommitAsync();

                    finalResult = Ok(new { 
                        message = "Event and Venue created successfully!", 
                        eventId = newEvent.Id 
                    });
                }
                catch (Exception ex)
                {
                    await transaction.RollbackAsync();
                    finalResult = BadRequest(new { 
                        message = "Failed to create event", 
                        error = ex.Message 
                    });
                }
            });

            return finalResult;
        }

        // 4. GET EVENTS BY CUSTOMER ID (Fixed Include)
        [HttpGet("{organizerId}/events")]
        public async Task<IActionResult> GetEventsByCustomerId(int organizerId)
        {
            try
            {
                // Corrected: Using .Include(e => e.Venue) to match EventDetails.cs
                var events = await _context.EventDetails
                    .Where(e => e.OrganizerId == organizerId)
                    .Include(e => e.Venue) 
                    .OrderByDescending(e => e.DateTime)
                    .ToListAsync();

                return Ok(events ?? new List<EventDetails>());
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return BadRequest(new { 
                    message = "Failed to retrieve events for this organizer", 
                    error = ex.Message 
                });
            }
        }

        // 5. GET ALL CUSTOMERS (ORGANIZERS)
        [HttpGet("all")]
        public async Task<IActionResult> GetAllCustomers()
        {
            try
            {
                // Fetch all organizers from the database
                // We select only non-sensitive data to return
                var customers = await _context.Organizers
                    .Select(o => new {
                        o.Id,
                        o.Name,
                        o.Email,
                        o.CompanyName
                    })
                    .ToListAsync();

                return Ok(customers);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return BadRequest(new { 
                    message = "Failed to retrieve customers", 
                    error = ex.Message 
                });
            }
        }
    }
}