using HotelManagement.Infrastructure.EntityFramework;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace HotelManagement.Infrastructure.ContextFactories;

internal class ApplicationDbContextFactory : IDesignTimeDbContextFactory<ApplicationDbContext>
{
    ApplicationDbContext IDesignTimeDbContextFactory<ApplicationDbContext>.CreateDbContext(string[] args)
    {
        var optionsBuilder = new DbContextOptionsBuilder<ApplicationDbContext>();
        optionsBuilder.UseNpgsql("Host=localhost:5432;Database=HotelManagement;Username=root;Password=root");
        ApplicationDbContext hotelManagementContext = new(optionsBuilder.Options);

        return hotelManagementContext;
    }
}