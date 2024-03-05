namespace HotelManagement.Core.Abstractions;

public interface IPaginatedResult<TResult>
{
    IEnumerable<TResult> Results { get; }

    int TotalCount { get; }
}