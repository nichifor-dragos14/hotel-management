﻿using HotelManagement.Core.Abstractions;
using HotelManagement.Core.Users;

namespace HotelManagement.Core.Properties;

public record CreatePropertyCommand(
    string Name,
    PropertyType Type,
    string Description,
    string Location,
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
    string PictureUrls,
    Guid UserId
) : ICommand<Guid?>;

internal class CreatePropertyCommandHandler(
    IUnitOfWork unitOfWork
) : ICommandHandler<CreatePropertyCommand, Guid?>
{
    public async Task<Guid?> ExecuteAsync(
        CreatePropertyCommand command,
        CancellationToken cancellationToken)
    {
        var properties = unitOfWork.GetRepository<Property>();

        unitOfWork.GetRepository<User>().TryGetById([command.UserId], out var user);

        if (user == null || user.Role != Role.Owner) 
        {
            return null;
        }

        var newProperty = Property.Create(
            command.Name,
            command.Type,
            command.Description,
            command.Location,
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
            command.PictureUrls,
            user
        );

        properties.Add(newProperty);

        await unitOfWork.SaveChangesAsync(cancellationToken);

        return newProperty.Id;
    }
}