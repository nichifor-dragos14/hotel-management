using HotelManagement.Core.Abstractions;
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
    int Rating,
    double ReviewRating,
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
    IEnumerable<RoomPropertyDetails> Rooms,
    IEnumerable<ReviewPropertyDetails> Reviews
);

public record ReviewPropertyDetails(
     Guid Id,
     string Title,
     string Description,
     double Rating,
     DateTime CreatedOn,
     DateTime UpdatedOn,
     ReviewUserPropertyDetails User
);

public record ReviewUserPropertyDetails(
    Guid Id,
    string FirstName,
    string LastName,
    string Nationality
);


public record RoomPropertyDetails(
    Guid Id,
    int Number,
    RoomType Type,
    int Price,
    int AdultCapacity,
    int ChildrenCapacity ,
    bool HasPrivateBathroom,
    bool HasTowels,
    bool HasHairdryer,
    bool HasAirConditioning,
    bool HasBalcony,
    bool HasRefrigerator,
    bool HasSeaView,
    DateTime CreatedOn,
    DateTime UpdatedOn
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
                 property.Rating,
                 property.Reviews.Select(r => r.Rating).Average(),
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
                 property.Rooms.Select(r => new RoomPropertyDetails(
                     r.Id,
                     r.Number,
                     r.Type,
                     r.Price,
                     r.AdultCapacity,
                     r.ChildrenCapacity,
                     r.HasPrivateBathroom,
                     r.HasTowels,
                     r.HasHairdryer,
                     r.HasAirConditioning,
                     r.HasBalcony,
                     r.HasRefrigerator,
                     r.HasSeaView,
                     r.CreatedOn,
                     r.UpdatedOn
                     )
                 ),
                 property.Reviews.Select(r => new ReviewPropertyDetails(
                     r.Id,
                     r.Title,
                     r.Description,
                     r.Rating,
                     r.CreatedOn,
                     r.UpdatedOn,
                     new ReviewUserPropertyDetails(
                         r.User.Id,
                         r.User.FirstName,
                         r.User.LastName,
                         r.User.Nationality
                         )
                     )
                 )
              )
            ).FirstOrDefault();
    }
}