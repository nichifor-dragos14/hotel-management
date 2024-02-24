namespace HotelManagement.Core.Abstractions;

public interface IQueryHandler<T, TResult> where T : IQuery<TResult>
{
    Task<TResult> ExecuteAsync(T query, CancellationToken cancellationToken);
}