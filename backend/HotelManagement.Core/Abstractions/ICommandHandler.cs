namespace HotelManagement.Core.Abstractions;

public interface ICommandHandler<T, TOutcome> where T : ICommand<TOutcome>
{
    Task<TOutcome> ExecuteAsync(T command, CancellationToken cancellationToken);
}