using HotelManagement.Core.Abstractions;
using Microsoft.Extensions.Configuration;

namespace HotelManagement.Infrastructure.Mocking;

public class MockQueryHandler<T, TResult>(
    IConfiguration config,
    ILogger<MockQueryHandler<T, TResult>> logger
) : IQueryHandler<T, TResult> where T : IQuery<TResult> where TResult : class
{
    public async Task<TResult> ExecuteAsync(T query, CancellationToken cancellationToken)
    {
        logger.LogInformation($"Getting mocks from `Mocks:{typeof(T).Name}");

        return config.GetSection($"Mocks:{typeof(T).Name}").Get<TResult>();
    }
}