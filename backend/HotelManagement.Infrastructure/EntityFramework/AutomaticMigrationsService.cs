using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace HotelManagement.Infrastructure.EntityFramework;

internal class AutomaticMigrationsService(
    IServiceProvider serviceProvider,
    ILogger<ILogger<AutomaticMigrationsService>> logger
) : IHostedService
{
    public async Task StartAsync(CancellationToken cancellationToken)
    {
        using var scope = serviceProvider.CreateScope();
        using var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

        try
        {
            logger.LogInformation("BEGIN MIGRATION");

            await context.Database.MigrateAsync(cancellationToken);

            logger.LogInformation("MIGRATION SUCCESSFUL!");
        }
        catch (Exception ex)
        {
            logger.LogError("An error occurred while migrating the database.", ex);
        }
    }

    public Task StopAsync(CancellationToken cancellationToken)
    {
        return Task.CompletedTask;
    }
}