using System.Reflection.Metadata;
using HotelManagement.WebApi;

[assembly: MetadataUpdateHandler(typeof(HotReloadManager))]

public static class HotReloadManager
{
    internal static SwaggerExportService SwaggerExportService { get; set; }

    public static void ClearCache(Type[]? updatedTypes)
    {
    }

    public static void UpdateApplication(Type[]? updatedTypes)
    {
        // Comment
        SwaggerExportService.StartAsync(CancellationToken.None);
    }
}