using HotelManagement.Core.Abstractions;
using HotelManagement.Core.Properties;
using Microsoft.EntityFrameworkCore;

namespace HotelManagement.Infrastructure.EntityFramework.Queries;

internal class AllPropertyRoomsQueryHandler(
    ApplicationDbContext dbContext
) : IQueryHandler<AllPropertyRoomsQuery, IPaginatedResult<PropertyRoom>>
{
    public async Task<IPaginatedResult<PropertyRoom>> ExecuteAsync(
        AllPropertyRoomsQuery query,
        CancellationToken cancellationToken
        )
    {
        return await dbContext
            .Database
            .SqlQuery<NpgsqlPaginatedResult<PropertyRoom>>(
                $"""
                    WITH PropertyRooms AS (
                        SELECT
                            r."Id",
                            r."Number",
                            r."Type",
                            r."Price",
                            r."AdultCapacity",
                            r."ChildrenCapacity",
                            r."HasPrivateBathroom",
                            r."HasTowels",
                            r."HasHairdryer",
                            r."HasAirConditioning",
                            r."HasBalcony",
                            r."HasRefrigerator",
                            r."HasSeaView",
                            r."CreatedOn",
                            r."UpdatedOn",
                            ROW_NUMBER() OVER (ORDER BY r."CreatedOn" DESC) AS "RowNumber"
                        FROM
                            "Room" AS r
                        WHERE r."PropertyId" = {query.Id}
                        ORDER BY
                            r."CreatedOn" DESC
                        OFFSET {query.From} ROWS FETCH NEXT {query.To - query.From} ROWS ONLY
                    )
                    SELECT
                        (SELECT COUNT(*) FROM "Room" WHERE "Room"."PropertyId" = {query.Id}) as "TotalCount",
                            CASE
                                WHEN (SELECT COUNT(*) FROM PropertyRooms) > 0
                                    THEN jsonb_agg(PropertyRooms)
                                ELSE '[]'::jsonb
                            END AS "Results"
                        FROM PropertyRooms
                """
            )
            .FirstAsync(cancellationToken);
    }
}
