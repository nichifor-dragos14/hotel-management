using HotelManagement.Core.Abstractions;
using HotelManagement.Core.Properties;
using HotelManagement.Core.Users;

namespace HotelManagement.Core.Rooms;

public record CreateRoomCommand(
    Guid PropertyId,
    int Number,
    RoomType Type,
    int Price,
    int AdultCapacity,
    int ChildrenCapacity,
    bool HasPrivateBathroom,
    bool HasTowels,
    bool HasHairdryer,
    bool HasAirConditioning,
    bool HasBalcony,
    bool HasRefrigerator,
    bool HasSeaView,
    Guid UserId
) : ICommand<Guid?>;

internal class CreateRoomCommandHandler(
    IUnitOfWork unitOfWork
) : ICommandHandler<CreateRoomCommand, Guid?>
{
    public async Task<Guid?> ExecuteAsync(
        CreateRoomCommand command,
        CancellationToken cancellationToken)
    {
        unitOfWork.GetRepository<User>().TryGetById([command.UserId], out var user);

        if (user == null || user.Role != Role.Owner)
        {
            return null;
        }

        var properties = unitOfWork.GetRepository<Property>();

        if (properties.TryGetById([command.PropertyId], out var property)) {
            var rooms = unitOfWork.GetRepository<Room>();

            var newRoom = Room.Create(
                command.Number,
                command.Type,
                command.Price,
                command.AdultCapacity,
                command.ChildrenCapacity,
                command.HasPrivateBathroom,
                command.HasTowels,
                command.HasHairdryer,
                command.HasAirConditioning,
                command.HasBalcony,
                command.HasRefrigerator,
                command.HasSeaView,
                property
            );

            rooms.Add(newRoom);

            await unitOfWork.SaveChangesAsync(cancellationToken);

            return newRoom.Id;
        }

        return null;
    }
}