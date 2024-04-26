using HotelManagement.Core.Abstractions;

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
    bool HasSeaView
) : ICommand<Guid?>;

internal class UpdateRoomCommandHandler(
    IUnitOfWork unitOfWork
) : ICommandHandler<UpdateRoomCommand, Guid?>
{
    public async Task<Guid?> ExecuteAsync(UpdateRoomCommand command, CancellationToken cancellationToken)
    {
        var rooms = unitOfWork.GetRepository<Room>();

        if (rooms.TryGetById([command.Id], out var room))
        {
            room.Update(
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

            return room.Id;
        }

        return null;
    }
}