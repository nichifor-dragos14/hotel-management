using System.Reflection;
using HotelManagement.Core.Abstractions;

namespace Microsoft.Extensions.DependencyInjection;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddCore(this IServiceCollection services)
    {
        foreach (var (generic, implementation) in typeof(ServiceCollectionExtensions)
                     .Assembly
                     .GetGenericTypeImplementationsOf(
                         typeof(IQueryHandler<,>), typeof(ICommandHandler<,>)
                     ))
            services.AddScoped(generic, implementation);

        return services;
    }
}