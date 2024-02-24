using System.Collections.Concurrent;
using System.Reflection;
using HealthChecks.UI.Client;
using HotelManagement.WebApi;
using HotelManagement.WebApi.Development;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Serilog;
using Serilog.Sinks.Elasticsearch;
using Vernou.Swashbuckle.HttpResultsAdapter;

var builder = WebApplication.CreateBuilder(args);
builder.Configuration.AddJsonFile("appsettings.Mocks.json", true, true);

builder.Host.UseSerilog((context, configuration) =>
{
    var environment = context.HostingEnvironment.EnvironmentName;

    configuration.Enrich.FromLogContext()
        .WriteTo.Elasticsearch(new ElasticsearchSinkOptions(new Uri(context.Configuration["ElasticConfiguration:Uri"]))
        {
            AutoRegisterTemplate = true,
            IndexFormat =
                $"{Assembly.GetExecutingAssembly().GetName().Name.ToLower().Replace(".", "-")}-{environment.ToLower()}-{DateTime.UtcNow:yyyy-MM}",
            NumberOfReplicas = 1,
            NumberOfShards = 2
        })
        .Enrich.WithProperty("Environment", environment)
        .ReadFrom.Configuration(context.Configuration);
});

ConcurrentDictionary<Guid, int> _counters = new();

var services = builder.Services;
var env = builder.Environment;

services.AddSingleton(_counters);
services.AddCore();
services.AddControllers();

services.AddHealthChecks()
    .AddElasticsearch(builder.Configuration["ElasticConfiguration:Uri"], "HotelManagement:Elasticsearch");
services.AddInfrastructure(builder.Configuration);

services.AddEndpointsApiExplorer();
services.AddSwaggerGen(settings =>
{
    settings.OperationFilter<HttpResultsOperationFilter>();
    settings.SchemaFilter<NonNullishAsRequiredSchemaFilter>();
    settings.SupportNonNullableReferenceTypes();
});
services.AddOpenApiDocument();

//services.AddHealthChecks();

if (env.IsDevelopment())
    // Only on dev mode we generate the swagger
    services.AddHostedService<SwaggerExportService>();

var app = builder.Build();

app.UseOpenApi();
app.UseSwaggerUi();
app.UseHttpsRedirection();
app.UseAuthorization();
app.UseHealthChecks("/healthy");
app.UseRouting();
app.MapControllers();
app.MapHealthChecks("/health-details",
    new HealthCheckOptions { ResponseWriter = UIResponseWriter.WriteHealthCheckUIResponse });

app.Run();