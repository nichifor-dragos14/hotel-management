using HotelManagement.Core.Abstractions;
using HotelManagement.Core.Users;

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
    string ImageUrls,
    Guid UserId
) : ICommand<Guid?>;

internal class UpdatePropertyCommandHandler(
    IUnitOfWork unitOfWork,
    IQueryFacade facade
) : ICommandHandler<UpdatePropertyCommand, Guid?>
{
    public async Task<Guid?> ExecuteAsync(
        UpdatePropertyCommand command,
        CancellationToken cancellationToken)
    {

        var propertyDetails =
            (from property in facade.Of<Property>()
             where property.Id == command.Id
             join user in facade.Of<User>() on property.UserId equals user.Id
             select new
             {
                 Property = property,
                 User = user
             }).FirstOrDefault();

        if (propertyDetails == null)
        {
            return null;
        }

        var propertyPart = propertyDetails.Property;
        var userPart = propertyDetails.User;

        unitOfWork.GetRepository<User>().TryGetById([command.UserId], out var loggedUser);

        if (loggedUser.Role != Role.Admin && userPart.Id != loggedUser.Id)
        {
            return null;
        }

        propertyPart.Update(
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

        return propertyPart.Id;
    }
}