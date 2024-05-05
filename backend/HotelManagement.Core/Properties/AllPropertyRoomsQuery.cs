using HotelManagement.Core.Abstractions;
using HotelManagement.Core.Rooms;

namespace HotelManagement.Core.Properties;

public record PropertyRoom(
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
    int DiscountPercentage,
    DateTime CreatedOn,
    DateTime UpdatedOn,
    int RowNumber
);

public record AllPropertyRoomsQuery(int From, int To, Guid Id, DateTime StartDate, DateTime EndDate, int NumberOfAdults, int NumberOfChildren, Guid? LoggedUserId) : IQuery<IPaginatedResult<PropertyRoom>>;