using HotelManagement.Core.Abstractions;

namespace HotelManagement.Core.Rooms;

public record RoomDetails(
    Guid Id,
    int Price,
    bool HasPrivateBathroom,
    bool HasTowels,
    bool HasHairdryer,
    bool HasAirConditioning,
    bool HasBalcony,
    bool HasRefrigerator,
    bool HasSeaView,
    int AdultCapacity,
    int ChildrenCapacity,
    int Number
);

public record OneRoomQuery(
    Guid? Id
) : IQuery<RoomDetails>;

internal class OneRoomQueryHandler(
    IQueryFacade facade
) : IQueryHandler<OneRoomQuery, RoomDetails>
{
    public async Task<RoomDetails> ExecuteAsync(
        OneRoomQuery query,
        CancellationToken cancellationToken
    )
    {
        return
            (from room in facade.Of<Room>()
             where room.Id == query.Id
             select new RoomDetails(
                 room.Id,
                 room.Price,
                 room.HasPrivateBathroom,
                 room.HasTowels,
                 room.HasHairdryer,
                 room.HasAirConditioning,
                 room.HasBalcony,
                 room.HasRefrigerator,
                 room.HasSeaView,
                 room.AdultCapacity,
                 room.ChildrenCapacity,
                 room.Number
             )
            ).FirstOrDefault();
    }
}
