using HotelManagement.Core.Abstractions;
using HotelManagement.Core.Rooms;
using Microsoft.EntityFrameworkCore;
using System.Runtime.CompilerServices;

namespace HotelManagement.Infrastructure.EntityFramework.Queries;

internal class AllRoomSummariesQueryHandler(
    ApplicationDbContext dbContext
) : IQueryHandler<AllRoomSummariesQuery, IPaginatedResult<RoomSummary>>
{
    public async Task<IPaginatedResult<RoomSummary>> ExecuteAsync(
        AllRoomSummariesQuery query,
        CancellationToken cancellationToken
        )
    {
        var queryBuild = $"""
                    WITH RoomSummaries AS (
                        SELECT
                            r."Id",
                            r."Number",
                            r."Type",
                            r."Price",        
                            r."AdultCapacity", 
                            r."ChildrenCapacity", 
                            ROW_NUMBER() OVER (ORDER BY r."CreatedOn" DESC) AS "RowNumber"
                        FROM
                            "Room" AS r              
                        WHERE r."PropertyId" = '{query.PropertyId}'
                        OFFSET {query.From} ROWS FETCH NEXT {query.To - query.From} ROWS ONLY
                    )
                    SELECT
                        CASE
                            WHEN (
                                SELECT COUNT(r."Id") 
                                FROM "Room" AS r
                                WHERE r."PropertyId" = '{query.PropertyId}'
                            ) IS NULL THEN 0
                            ELSE (
                                SELECT COUNT(r."Id") 
                                FROM "Room" AS r
                                WHERE r."PropertyId" = '{query.PropertyId}'
                            )
                        END AS "TotalCount",
                            CASE
                                WHEN (SELECT COUNT(*) FROM RoomSummaries) > 0
                                    THEN jsonb_agg(RoomSummaries)
                                ELSE '[]'::jsonb
                            END AS "Results"
                        FROM RoomSummaries
                """;

        var queryFinal = FormattableStringFactory.Create(queryBuild);

        return await dbContext
            .Database
            .SqlQuery<NpgsqlPaginatedResult<RoomSummary>>(queryFinal)
            .FirstAsync(cancellationToken);
    }
}
