using HotelManagement.Core.Abstractions;
using HotelManagement.Infrastructure.EntityFramework;
using HotelManagement.Infrastructure.ExtensionMethods;
using HotelManagement.Infrastructure.Microsoft;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Npgsql;
using Quartz;
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

        services.AddQuartz(q =>
        {
            var jobKey = new JobKey("DiscountJob");
            q.AddJob<DiscountJob>(opts => opts.WithIdentity(jobKey));

            q.AddTrigger(opts => opts
                .ForJob(jobKey)
                .WithIdentity("SendEmailJob-trigger")
                .WithCronSchedule("0 * * ? * *")
            );
        });
        services.AddQuartzHostedService(q => q.WaitForJobsToComplete = true);
        services.AddHostedService<QuartzHostedService>();

        foreach (var (generic, implementation) in typeof(ServiceCollectionExtensions)
            .Assembly
            .GetGenericTypeImplementationsOf(typeof(IQueryHandler<,>)))
        {
            services.AddScoped(generic, implementation);
        }

        return services;
    }
}