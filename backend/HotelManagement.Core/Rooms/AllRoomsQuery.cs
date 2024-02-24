using HotelManagement.Core.Abstractions;

namespace HotelManagement.Core.Rooms;

public record RoomSummary(
    Guid Id,
    int Number
);

public record AllRoomsQuery : IQuery<IEnumerable<RoomSummary>>;

internal class AllRoomsQueryHandler(
    IQueryFacade facade
) : IQueryHandler<AllRoomsQuery, IEnumerable<RoomSummary>>
{
    public async Task<IEnumerable<RoomSummary>> ExecuteAsync(
        AllRoomsQuery query,
        CancellationToken cancellationToken)
    {
        return
            from room in facade.Of<Room>()
            select new RoomSummary(
                room.Id,
                room.Number
            );
    }
}