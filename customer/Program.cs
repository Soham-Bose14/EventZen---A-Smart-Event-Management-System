using Microsoft.EntityFrameworkCore;
using customer.Data; 

var builder = WebApplication.CreateBuilder(args);

// 1. Add Controllers service (CRITICAL: Your API won't work without this)
builder.Services.AddControllers();

// 2. Get Connection String from appsettings.json
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

// 3. Configure Entity Framework with MySQL (Using ApplicationDbContext)
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));

// 4. Add CORS so your React app can talk to .NET
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy => policy.WithOrigins("http://localhost:3000")
                        .AllowAnyMethod()
                        .AllowAnyHeader());
});

var app = builder.Build();

// --- Middleware Pipeline ---

// Enable CORS
app.UseCors("AllowReactApp");

// Ensure the app knows how to route to your Controllers
app.MapControllers();

app.Run();