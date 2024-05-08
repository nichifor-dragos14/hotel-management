using HotelManagement.Core.Abstractions;

namespace HotelManagement.Core.Rooms;

public record RoomSummary(
    Guid Id,
    int Number,
    RoomType Type,
    int Price,
    int AdultCapacity,
    int ChildrenCapacity,
    int RowNumber
);

public record AllRoomSummariesQuery(
    int From,
    int To, 
    Guid PropertyId
) : IQuery<IPaginatedResult<RoomSummary>>;
