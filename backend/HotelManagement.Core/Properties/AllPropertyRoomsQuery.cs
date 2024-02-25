using HotelManagement.Core.Abstractions;
using HotelManagement.Core.Rooms;

namespace HotelManagement.Core.Properties;

public record PropertyRooms(
    Guid PropertyId,
    Guid RoomId,
    int Number,
    RoomType Type,
    DateTime CreatedOn,
    DateTime UpdatedOn
);

public record AllPropertyRoomsQuery(Guid? Id) : IQuery<IEnumerable<PropertyRooms>>;

internal class AllPropertyRoomsQueryHandler(
    IQueryFacade facade
) : IQueryHandler<AllPropertyRoomsQuery, IEnumerable<PropertyRooms>>
{
    public async Task<IEnumerable<PropertyRooms>> ExecuteAsync(
        AllPropertyRoomsQuery query,
        CancellationToken cancellationToken)
    {
        return
            from property in facade.Of<Property>()
            where property.Id == query.Id
            join room in facade.Of<Room>() on property.Id equals room.Property.Id
            select new PropertyRooms(
                property.Id,
                room.Id,
                room.Number,
                room.Type,
                room.CreatedOn,
                room.UpdatedOn
            );
    }
}