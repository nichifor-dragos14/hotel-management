using HotelManagement.Core.Abstractions;
using HotelManagement.Core.Properties;
using HotelManagement.Core.Users;

namespace HotelManagement.Core.Rooms;

public record UpdateRoomCommand(
    Guid Id,
    int Price,
    bool HasPrivateBathroom,
    bool HasTowels,
    bool HasHairdryer,
    bool HasAirConditioning,
    bool HasBalcony,
    bool HasRefrigerator,
    bool HasSeaView,
    Guid UserId
) : ICommand<Guid?>;

internal class UpdateRoomCommandHandler(
    IUnitOfWork unitOfWork,
    IQueryFacade facade
) : ICommandHandler<UpdateRoomCommand, Guid?>
{
    public async Task<Guid?> ExecuteAsync(
        UpdateRoomCommand command, 
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
            return null;
        }

        var roomPart = roomDetails.Room;
        var userPart = roomDetails.User;

        unitOfWork.GetRepository<User>().TryGetById([command.UserId], out var loggedUser);

        if (loggedUser.Role != Role.Admin && userPart.Id != loggedUser.Id)
        {
            return null;
        }

        var rooms = unitOfWork.GetRepository<Room>();
  
        roomPart.Update(
            command.Price,
            command.HasPrivateBathroom,
            command.HasTowels,
            command.HasHairdryer,
            command.HasAirConditioning,
            command.HasBalcony,
            command.HasRefrigerator,
            command.HasSeaView
        );

        await unitOfWork.SaveChangesAsync(cancellationToken);

        return roomPart.Id;
    }
}