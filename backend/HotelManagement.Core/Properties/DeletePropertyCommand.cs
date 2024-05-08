using HotelManagement.Core.Abstractions;

namespace HotelManagement.Core.Properties;

public record DeletePropertyCommand(
    Guid Id
) : ICommand<bool>;

internal class DeletePropertyCommandHandler(
    IUnitOfWork unitOfWork) : ICommandHandler<DeletePropertyCommand, bool>
{
    public async Task<bool> ExecuteAsync(
        DeletePropertyCommand command,
        CancellationToken cancellationToken)
    {
        var properties = unitOfWork.GetRepository<Property>();

        if (properties.TryGetById([command.Id], out var property))
        {
            properties.Remove(property);

            await unitOfWork.SaveChangesAsync(cancellationToken);

            return true;
        }

        return false;
    }
}