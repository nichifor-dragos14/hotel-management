using HotelManagement.Core.Abstractions;
using HotelManagement.Infrastructure.EntityFramework;
using HotelManagement.Infrastructure.Microsoft;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Npgsql;
using System.Reflection;

namespace Microsoft.Extensions.DependencyInjection;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration
    )
    {
        services
            .AddSingleton((serviceProvider) =>
            {
                var dataSourceBuilder = new NpgsqlDataSourceBuilder(configuration.GetConnectionString("Default"));
                dataSourceBuilder.EnableDynamicJson();

                return dataSourceBuilder.Build();
            });

        services
            .AddDbContext<ApplicationDbContext>(options =>
                options.UseNpgsql(configuration.GetConnectionString("Default")))
            .AddScoped<IUnitOfWork, EFCoreUnitOfWork>()
            .AddScoped<IQueryFacade, EFCoreQueryFacade>()
            .AddScoped(typeof(ILogger<>), typeof(MicrosoftLogger<>))
            .AddHostedService<AutomaticMigrationsService>()
            .AddHealthChecks()
            .AddCheck<DbContextHealthCheck<ApplicationDbContext>>("Postgres:HotelManagement");

        foreach (var (generic, implementation) in typeof(ServiceCollectionExtensions)
            .Assembly
            .GetGenericTypeImplementationsOf(typeof(IQueryHandler<,>)))
        {
            services.AddScoped(generic, implementation);
        }

        return services;
    }
}