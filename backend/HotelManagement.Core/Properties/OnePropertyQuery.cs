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
    bool HasKitchen,
    bool HasFreeCancellation,
    bool PrepaymentNeeded,
    int ReviewCount,
    List<string> ImageUrls,
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
    string Nationality,
    string ProfilePicture
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

public record OnePropertyQuery(Guid? Id, DateTime StartDate, DateTime EndDate) : IQuery<PropertyDetails>;