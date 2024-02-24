using Microsoft.Extensions.Logging;

namespace HotelManagement.Infrastructure.Microsoft;

internal class MicrosoftLogger<T>(ILogger<T> logger) : Core.Abstractions.ILogger<T>
{
    public void LogInformation(string template)
    {
        logger.LogInformation(template);
    }
}