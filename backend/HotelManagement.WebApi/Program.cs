using System.Reflection;
using System.Text;
using HealthChecks.UI.Client;
using HotelManagement.WebApi;
using HotelManagement.WebApi.Development;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.IdentityModel.Tokens;
using NSwag.Generation.Processors.Security;
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

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidIssuer = builder.Configuration["JWT:Issuer"],
            ValidAudience = builder.Configuration["JWT:Audience"],
            IssuerSigningKey =  new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["JWT:SecretKey"]))
        };
});


builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(settings =>
{
    settings.OperationFilter<HttpResultsOperationFilter>();
    settings.SchemaFilter<NonNullishAsRequiredSchemaFilter>();
    settings.SupportNonNullableReferenceTypes();
});


builder.Services.AddHealthChecks()
    .AddElasticsearch(builder.Configuration["ElasticConfiguration:Uri"], "HotelManagement:Elasticsearch");
builder.Services.AddCore();
builder.Services.AddControllers();
builder.Services.AddInfrastructure(builder.Configuration);
builder.Services.AddOpenApiDocument(settings =>
{
    settings.AddSecurity(JwtBearerDefaults.AuthenticationScheme, new NSwag.OpenApiSecurityScheme()
    {
        Name = "Authorization",
        Type = NSwag.OpenApiSecuritySchemeType.ApiKey,
        Scheme = JwtBearerDefaults.AuthenticationScheme,
        BearerFormat = "JWT",
        In = NSwag.OpenApiSecurityApiKeyLocation.Header,
        Description = "Please enter the token using the format: \"Bearer [space] YOUR_TOKEN\""
    });
    settings.OperationProcessors.Add(new OperationSecurityScopeProcessor(JwtBearerDefaults.AuthenticationScheme));
});



if (builder.Environment.IsDevelopment())
{
    builder.Services.AddHostedService<SwaggerExportService>();
}

var app = builder.Build();

app.UseHttpsRedirection();
app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();
app.UseOpenApi();
app.UseSwaggerUi();
app.UseHealthChecks("/healthy");
app.MapHealthChecks(
    "/health-details",
    new HealthCheckOptions
    {
        ResponseWriter = UIResponseWriter.WriteHealthCheckUIResponse 
    }
);
app.MapControllers();

app.Run();