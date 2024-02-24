using Microsoft.EntityFrameworkCore;

namespace HotelManagement.Infrastructure.EntityFramework;

internal class ApplicationDbContext(
    DbContextOptions<ApplicationDbContext> options
) : DbContext(options)
{
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(GetType().Assembly);
    }
}