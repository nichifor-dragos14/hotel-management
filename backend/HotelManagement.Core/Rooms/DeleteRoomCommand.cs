using HotelManagement.Core.Abstractions;
using HotelManagement.Core.Rooms;
using HotelManagement.Core.Users;

namespace HotelManagement.Core.Properties;

public record DeleteRoomCommand(
    Guid Id,
    Guid UserId
) : ICommand<bool>;

internal class DeleteRoomCommandHandler(
    IUnitOfWork unitOfWork,
    IQueryFacade facade
) : ICommandHandler<DeleteRoomCommand, bool>
{
    public async Task<bool> ExecuteAsync(
        DeleteRoomCommand command, 
        CancellationToken cancellationToken)
    {
        var roomDetails =
           (from room in facade.Of<Room>()
            where room.Id == command.Id
            join property in facade.Of<Property>() on room.PropertyId equals property.Id
            join user in facade.Of<User>() on property.UserId equals user.Id
            select new
            {
                Room = room,
                User = user
            }).FirstOrDefault();

        if (roomDetails == null)
        {
            return false;
        }

        var roomPart = roomDetails.Room;
        var userPart = roomDetails.User;

        unitOfWork.GetRepository<User>().TryGetById([command.UserId], out var loggedUser);

        if (loggedUser.Role != Role.Admin && userPart.Id != loggedUser.Id)
        {
            return false;
        }

        var rooms = unitOfWork.GetRepository<Room>();

        rooms.Remove(roomPart);

        await unitOfWork.SaveChangesAsync(cancellationToken);

        return true;
    }
}