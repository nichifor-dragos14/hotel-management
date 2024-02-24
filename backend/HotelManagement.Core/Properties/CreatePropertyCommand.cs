using HotelManagement.Core.Abstractions;

namespace HotelManagement.Core.Properties;

public record CreatePropertyCommand(
    string Name,
    PropertyType Type,
    string Description,
    string Location,
    string Email,
    string PhoneNumber,
    bool HasFreeWiFi,
    bool HasParking,
    bool HasPool,
    bool HasRestaurant,
    bool HasFitnessCentre,
    bool HasRoomService,
    bool HasPetFriendlyPolicy,
    bool HasBreakfast,
    bool HasFreeCancellation
) : ICommand<Guid?>;

internal class CreatePropertyCommandHandler(
    IUnitOfWork unitOfWork
) : ICommandHandler<CreatePropertyCommand, Guid?>
{
    public async Task<Guid?> ExecuteAsync(CreatePropertyCommand command, CancellationToken cancellationToken)
    {
        var properties = unitOfWork.GetRepository<Property>();
        var newProperty = Property.Create(
            command.Name,
            command.Type,
            command.Description,
            command.Location,
            command.Email,
            command.PhoneNumber,
            command.HasFreeWiFi,
            command.HasParking,
            command.HasPool,
            command.HasRestaurant,
            command.HasFitnessCentre,
            command.HasRoomService,
            command.HasPetFriendlyPolicy,
            command.HasBreakfast,
            command.HasFreeCancellation
        );

        properties.Add(newProperty);
        await unitOfWork.SaveChangesAsync(cancellationToken);

        return newProperty.Id;
    }
}