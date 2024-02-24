namespace Microsoft.AspNetCore.Builder;

public static class ApplicationBuilderExtensions
{
    public static IApplicationBuilder UseInfrastructure(this IApplicationBuilder app)
    {
        return app;
    }
}