using HotelManagement.Core.Abstractions;

namespace HotelManagement.Core.Properties;

public record UpdatePropertyCommand(
    Guid Id,
    string Name,
    string Description,
    string Email,
    string PhoneNumber,
    int Rating,
    bool PrepaymentNeeded,
    bool HasFreeWiFi,
    bool HasParking,
    bool HasKitchen,
    bool HasPool,
    bool HasRestaurant,
    bool HasFitnessCenter,
    bool HasRoomService,
    bool HasPetFriendlyPolicy,
    bool HasBreakfast,
    bool HasFreeCancellation,
    string ImageUrls
) : ICommand<Guid?>;

internal class UpdatePropertyCommandHandler(
    IUnitOfWork unitOfWork
) : ICommandHandler<UpdatePropertyCommand, Guid?>
{
    public async Task<Guid?> ExecuteAsync(UpdatePropertyCommand command, CancellationToken cancellationToken)
    {
        var properties = unitOfWork.GetRepository<Property>();

        if (properties.TryGetById([command.Id], out var property))
        {
            property.Update(
                command.Name,
                command.Description,
                command.Email,
                command.PhoneNumber,
                command.Rating,
                command.PrepaymentNeeded,
                command.HasFreeWiFi,
                command.HasParking,
                command.HasKitchen,
                command.HasPool,
                command.HasRestaurant,
                command.HasFitnessCenter,
                command.HasRoomService,
                command.HasPetFriendlyPolicy,
                command.HasBreakfast,
                command.HasFreeCancellation,
                command.ImageUrls
            );

            await unitOfWork.SaveChangesAsync(cancellationToken);

            return property.Id;
        }

        return null;
    }
}