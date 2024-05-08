using HotelManagement.Core.Abstractions;
using HotelManagement.Core.Rooms;

namespace HotelManagement.Core.Properties;

public record DeleteRoomCommand(
    Guid Id
) : ICommand<bool>;

internal class DeleteRoomCommandHandler(
    IUnitOfWork unitOfWork
) : ICommandHandler<DeleteRoomCommand, bool>
{
    public async Task<bool> ExecuteAsync(
        DeleteRoomCommand command, 
        CancellationToken cancellationToken)
    {
        var rooms = unitOfWork.GetRepository<Room>();

        if (rooms.TryGetById([command.Id], out var room))
        {
            rooms.Remove(room);

            await unitOfWork.SaveChangesAsync(cancellationToken);

            return true;
        }

        return false;
    }
}