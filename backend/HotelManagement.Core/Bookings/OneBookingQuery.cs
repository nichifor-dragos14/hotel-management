using HotelManagement.Core.Abstractions;
using HotelManagement.Core.Properties;
using HotelManagement.Core.Rooms;

namespace HotelManagement.Core.Bookings;

public record BookingDetails(
    Guid Id,
    DateTime StartDate,
    DateTime EndDate,
    int TotalPrice,
    string FirstNameOnBooking,
    string LastNameOnBooking,
    string EmailOnBooking,
    string PhoneNumberOnBooking,
    string CountryOnBooking,
    string SpecialMentions,
    string ExpectedArrival,
    DateTime CreatedOn,
    DateTime UpdatedOn,
    Guid ReviewId,
    Guid ReportId,
    BookingPropertyDetails PropertyDetails,
    BookingRoomDetails RoomDetails
);

public record BookingPropertyDetails(
    Guid Id,
    string Name,
    PropertyType Type,
    string Location,
    string Email,
    string PhoneNumber,
    int Rating,
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
    bool PrepaymentNeeded
);

public record BookingRoomDetails(
    Guid Id,
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
    Guid PropertyId,
    DateTime CreatedOn,
    DateTime UpdatedOn
);

public record OneBookingQuery(Guid? Id) : IQuery<BookingDetails>;
