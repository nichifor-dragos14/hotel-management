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
     ReviewUserPropertyDetails? User
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
        CancellationToken cancellationToken)
    {
        var propertyDetails = (from p in facade.Of<Property>()
                               where p.Id == query.Id
                               select new
                               {
                                   Property = p,
                                   Rooms = p.Rooms.OrderBy(r => r.CreatedOn).Take(3),
                                   Reviews = p.Reviews.OrderBy(r => r.CreatedOn).Take(5).Select(r => new
                                   {
                                       Review = r,
                                       r.User
                                   })
                               })
                               .FirstOrDefault();

        if (propertyDetails == null)
        {
            return null;
        }

        var roomsDetails = propertyDetails.Rooms.Select(r => new RoomPropertyDetails(
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
        )).ToList();

        var reviewsDetails = propertyDetails.Reviews.Select(r => new ReviewPropertyDetails(
            r.Review.Id,
            r.Review.Title,
            r.Review.Description,
            r.Review.Rating,
            r.Review.CreatedOn,
            r.Review.UpdatedOn,
            r.User == null ? null : new ReviewUserPropertyDetails(
                r.User.Id,
                r.User.FirstName,
                r.User.LastName,
                r.User.Nationality
            )
        )).ToList();

        var property = propertyDetails.Property;

        return new PropertyDetails(
            property.Id,
            property.Name,
            property.Type,
            property.Description,
            property.Location,
            property.Email,
            property.PhoneNumber,
            property.Rating,
            property.Reviews?.Any() == true ? property.Reviews.Average(r => r.Rating) : 0,
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
            roomsDetails,
            reviewsDetails
        );
    }
}