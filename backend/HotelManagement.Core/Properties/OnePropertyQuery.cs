using HotelManagement.Core.Abstractions;
using HotelManagement.Core.Reviews;
using HotelManagement.Core.Rooms;

namespace HotelManagement.Core.Properties;

public record PropertyDetails(
    Guid Id,
    string Name,
    PropertyType Type,
    string Description,
    string Location,
    string Email,
    string PhoneNumber,
    DateTime CreatedOn,
    DateTime UpdatedOn,
    bool HasFreeWiFi,
    bool HasParking,
    bool HasPool,
    bool HasRestaurant,
    bool HasFitnessCenter,
    bool HasRoomService,
    bool HasPetFriendlyPolicy,
    bool HasBreakfast,
    bool HasFreeCancellation,
    bool PrepaymentNeeded,
    int Rating,
    List<Room> Rooms,
    List<Review> Reviews
);

public record OnePropertyQuery(Guid? Id) : IQuery<PropertyDetails>;

internal class OneHotelQueryHandler(
    IQueryFacade facade
) : IQueryHandler<OnePropertyQuery, PropertyDetails>
{
    public async Task<PropertyDetails> ExecuteAsync(
        OnePropertyQuery query,
        CancellationToken cancellationToken
    )
    {
        return
            (from property in facade.Of<Property>()
             where property.Id == query.Id
             select new PropertyDetails(
                 property.Id,
                 property.Name,
                 property.Type,
                 property.Description,
                 property.Location,
                 property.Email,
                 property.PhoneNumber,
                 property.CreatedOn,
                 property.UpdatedOn,
                 property.HasFreeWiFi,
                 property.HasParking,
                 property.HasPool,
                 property.HasRestaurant,
                 property.HasFitnessCenter,
                 property.HasRoomService,
                 property.HasPetFriendlyPolicy,
                 property.HasBreakfast,
                 property.HasFreeCancellation,
                 property.PrepaymentNeeded,
                 property.Rating,
                 property.Rooms,
                 property.Reviews
             )
            ).FirstOrDefault();
    }
}