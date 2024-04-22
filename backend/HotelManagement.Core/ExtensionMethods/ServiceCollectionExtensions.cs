using System.Reflection;
using Google.Apis.Auth.OAuth2;
using Google.Apis.Drive.v3;
using Google.Apis.Services;
using HotelManagement.Core.Abstractions;
using HotelManagement.Core.EmailService;
using HotelManagement.Core.FileStorageService;
using static Google.Apis.Drive.v3.DriveService;

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

        services.AddSingleton(new DriveService(new BaseClientService.Initializer()
        {
            HttpClientInitializer = GoogleCredential.FromFile("credentials.json").CreateScoped(ScopeConstants.DriveFile),
            ApplicationName = "HotelManagement"
        }));

        services.AddScoped<IEmailService, EmailService>();
        services.AddScoped<IFileStorageService, GoogleDriveImageUploaderService>();

        return services;
    }
}