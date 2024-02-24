using HotelManagement.Core.Abstractions;
using Microsoft.Extensions.Configuration;

namespace HotelManagement.Infrastructure.Mocking;

public class MockCommandHandler<T, TOutcome>(
    IConfiguration config,
    ILogger<MockCommandHandler<T, TOutcome>> logger
) : ICommandHandler<T, TOutcome> where T : ICommand<TOutcome>
{
    public async Task<TOutcome> ExecuteAsync(T command, CancellationToken cancellationToken)
    {
        logger.LogInformation($"Getting mocks from `Mocks:{typeof(T).Name}");

        return config.GetSection($"Mocks:{typeof(T).Name}").Get<TOutcome>();
    }
}