using HotelManagement.Core.Abstractions;
using HotelManagement.Infrastructure.EntityFramework;
using HotelManagement.Infrastructure.Microsoft;
using HotelManagement.Infrastructure.Mocking;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace Microsoft.Extensions.DependencyInjection;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration
    )
    {
        services
            .AddDbContext<ApplicationDbContext>(options =>
                options.UseNpgsql(configuration.GetConnectionString("Default")))
            .AddScoped<IUnitOfWork, EFCoreUnitOfWork>()
            .AddScoped<IQueryFacade, EFCoreQueryFacade>()
            .AddScoped(typeof(ILogger<>), typeof(MicrosoftLogger<>))
            .AddScoped(typeof(IQueryHandler<,>), typeof(MockQueryHandler<,>))
            .AddScoped(typeof(ICommandHandler<,>), typeof(MockCommandHandler<,>))
            .AddHostedService<AutomaticMigrationsService>()
            .AddHealthChecks()
            .AddCheck<DbContextHealthCheck<ApplicationDbContext>>("Postgres:HotelManagement");

        return services;
    }
}