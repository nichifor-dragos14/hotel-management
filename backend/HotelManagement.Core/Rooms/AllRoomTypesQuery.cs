using HotelManagement.Core.Abstractions;

namespace HotelManagement.Core.Rooms;

public record RoomTypeSummary(
    string Type,
    RoomType Value
);

public record AllRoomTypesQuery : IQuery<IEnumerable<RoomTypeSummary>>;

internal class AllRoomTypesQueryHandler(
    IQueryFacade facade
) : IQueryHandler<AllRoomTypesQuery, IEnumerable<RoomTypeSummary>>
{
    public async Task<IEnumerable<RoomTypeSummary>> ExecuteAsync(
        AllRoomTypesQuery query,
        CancellationToken cancellationToken)
    {
        List<RoomTypeSummary> summaries = [];

        foreach (RoomType type in Enum.GetValues(typeof(RoomType)))
        {
            summaries.Add(new RoomTypeSummary(type.ToString(), type));
        }

        return summaries;
    }
}