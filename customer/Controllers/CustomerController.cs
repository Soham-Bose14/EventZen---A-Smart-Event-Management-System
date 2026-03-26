using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using customer.Data;
using customer.Models;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Text;

namespace customer.Controllers
{
    // ---------------- DTOs ----------------

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
        public int TotalTickets { get; set; }

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

        // ---------------- JWT TOKEN GENERATOR ----------------

        private string GenerateJwtToken(string email)
        {
            var securityKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes("EventZenSuperSecretKeyEventZenSuperSecretKey")
            );

            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: "EventZen",
                audience: null,
                claims: null,
                expires: DateTime.Now.AddHours(24),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        // ---------------- 1. REGISTER ORGANIZER ----------------

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] Organizer customer)
        {
            try
            {
                if (await _context.Organizers.AnyAsync(o => o.Email == customer.Email))
                {
                    return BadRequest(new
                    {
                        message = "Registration failed",
                        error = "Email already registered."
                    });
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

                return Ok(new
                {
                    id = newOrganizer.Id,
                    name = newOrganizer.Name,
                    email = newOrganizer.Email
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    message = "Registration failed",
                    error = ex.Message
                });
            }
        }

        // ---------------- 2. LOGIN ORGANIZER ----------------

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var customer = await _context.Organizers
                .FirstOrDefaultAsync(o => o.Email == request.Email && o.Password == request.Password);

            if (customer == null)
                return Unauthorized(new { message = "Invalid email or password" });

            var token = GenerateJwtToken(customer.Email);

            return Ok(new
            {
                token = token,
                user = new
                {
                    customer.Id,
                    customer.Name,
                    customer.Email,
                    customer.CompanyName
                }
            });
        }

        // ---------------- 3. CREATE EVENT (PENDING APPROVAL) ----------------

        [HttpPost("{organizerId}/create-event")]
        public async Task<IActionResult> CreateEvent(int organizerId, [FromBody] EventCreateDto dto)
        {
            var strategy = _context.Database.CreateExecutionStrategy();
            IActionResult finalResult = BadRequest(new { message = "Unexpected error occurred" });

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
                        TotalTickets = dto.TotalTickets > 0 ? dto.TotalTickets : dto.AvailableTickets,
                        OrganizerId = organizerId,
                        Status = "Pending" // NEW
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

                    finalResult = Ok(new
                    {
                        message = "Event submitted for admin approval",
                        eventId = newEvent.Id,
                        status = newEvent.Status
                    });
                }
                catch (Exception ex)
                {
                    await transaction.RollbackAsync();

                    finalResult = BadRequest(new
                    {
                        message = "Failed to create event",
                        error = ex.Message
                    });
                }
            });

            return finalResult;
        }

        // ---------------- 4. GET EVENTS BY ORGANIZER ----------------

        [HttpGet("{organizerId}/events")]
        public async Task<IActionResult> GetEventsByCustomerId(int organizerId)
        {
            try
            {
                var events = await _context.EventDetails
                    .Where(e => e.OrganizerId == organizerId && e.Status == "Approved") // ✅ Added filter
                    .Include(e => e.Venue)
                    .OrderByDescending(e => e.DateTime)
                    .Select(e => new
                    {
                        e.Id,
                        e.Title,
                        e.Description,
                        e.EventType,
                        e.DateTime,
                        e.Price,
                        e.ImagePath,
                        e.AvailableTickets,
                        e.TotalTickets,
                        e.Status,
                        TicketsSold = e.TotalTickets - e.AvailableTickets,
                        Revenue = (e.TotalTickets - e.AvailableTickets) * e.Price,
                        Venue = e.Venue != null ? new
                        {
                            e.Venue.Venue,
                            e.Venue.City,
                            e.Venue.Address
                        } : null
                    })
                    .ToListAsync();

                return Ok(events);
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    message = "Failed to retrieve events",
                    error = ex.Message
                });
            }
        }

        // ---------------- 5. GET ALL ORGANIZERS ----------------

        [HttpGet("all")]
        public async Task<IActionResult> GetAllCustomers()
        {
            try
            {
                var customers = await _context.Organizers
                    .Select(o => new
                    {
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
                return BadRequest(new
                {
                    message = "Failed to retrieve customers",
                    error = ex.Message
                });
            }
        }

        // ---------------- ADMIN: GET PENDING EVENTS ----------------

        [HttpGet("admin/pending-events")]
        public async Task<IActionResult> GetPendingEvents()
        {
            var events = await _context.EventDetails
                .Where(e => e.Status == "Pending")
                .Include(e => e.Venue)
                .ToListAsync();

            return Ok(events);
        }

        // ---------------- ADMIN: APPROVE EVENT ----------------

        [HttpPut("admin/approve/{eventId}")]
        public async Task<IActionResult> ApproveEvent(int eventId)
        {
            var ev = await _context.EventDetails.FindAsync(eventId);

            if (ev == null)
                return NotFound();

            ev.Status = "Approved";

            await _context.SaveChangesAsync();

            return Ok(new { message = "Event approved successfully" });
        }

        // ---------------- ADMIN: REJECT EVENT ----------------

        [HttpPut("admin/reject/{eventId}")]
        public async Task<IActionResult> RejectEvent(int eventId)
        {
            var ev = await _context.EventDetails.FindAsync(eventId);

            if (ev == null)
                return NotFound();

            ev.Status = "Rejected";

            await _context.SaveChangesAsync();

            return Ok(new { message = "Event rejected" });
        }
    }
}