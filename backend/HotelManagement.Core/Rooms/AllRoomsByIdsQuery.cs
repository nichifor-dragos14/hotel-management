using HotelManagement.Core.Abstractions;
using HotelManagement.Core.Properties;

namespace HotelManagement.Core.Rooms;

public record AllRoomsByIdsQuery(
    List<Guid> Ids
) : IQuery<IEnumerable<RoomPropertyDetails>>;

internal class AllRoomsByIdsQueryHandler(
    IQueryFacade facade
) : IQueryHandler<AllRoomsByIdsQuery, IEnumerable<RoomPropertyDetails>>
{
    public async Task<IEnumerable<RoomPropertyDetails>> ExecuteAsync(
        AllRoomsByIdsQuery query,
        CancellationToken cancellationToken)
    {
        return
            from r in facade.Of<Room>()
            where query.Ids.Contains(r.Id) 
            select new RoomPropertyDetails(
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
            );
    }
}
