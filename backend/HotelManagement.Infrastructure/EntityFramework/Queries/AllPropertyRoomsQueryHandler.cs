using HotelManagement.Core.Abstractions;
using HotelManagement.Core.Properties;
using Microsoft.EntityFrameworkCore;
using System.Runtime.CompilerServices;

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
        var whereClause = $"WHERE r.\"PropertyId\" = '{query.Id}'" +
            $"              AND NOT EXISTS (SELECT 1 FROM \"Booking\"" +
            $"                      WHERE \"Booking\".\"RoomId\" = r.\"Id\"" +
            $"                      AND NOT (\"Booking\".\"StartDate\" >= '{query.EndDate}'" +
            $"                      OR \"Booking\".\"EndDate\" <= '{query.StartDate}'))" +
            $"              AND r.\"AdultCapacity\" >= {query.NumberOfAdults}" +
            $"              AND r.\"AdultCapacity\" + r.\"ChildrenCapacity\" >= {query.NumberOfChildren} + {query.NumberOfAdults}";

        var queryBuild = $"""
                    WITH PropertyRooms AS (
                        SELECT
                            r."Id",
                            r."Number",
                            r."Type",
                            r."Price" * {(query.EndDate - query.StartDate).Days} AS "Price",
                            r."AdultCapacity",
                            r."ChildrenCapacity",
                            r."HasPrivateBathroom",
                            r."HasTowels",
                            r."HasHairdryer",
                            r."HasAirConditioning",
                            r."HasBalcony",
                            r."HasRefrigerator",
                            r."HasSeaView",
                            COALESCE(d."DiscountPercentage", 0) AS "DiscountPercentage",
                            r."CreatedOn",
                            r."UpdatedOn",
                            ROW_NUMBER() OVER (ORDER BY r."CreatedOn" DESC) AS "RowNumber"
                        FROM
                            "Room" AS r
                        LEFT JOIN 
                            "Discount" AS d
                        ON 
                            d."PropertyId" = '{query.Id}' AND d."UserId" = '{query.LoggedUserId}' AND '{DateTime.UtcNow}' <= d."EndDate"
                        {whereClause}
                        ORDER BY
                            r."CreatedOn" DESC
                        OFFSET {query.From} ROWS FETCH NEXT {query.To - query.From} ROWS ONLY
                    )
                    SELECT
                        (SELECT COUNT(*) FROM "Room" AS r
                        {whereClause}
                        ) AS "TotalCount",
                            CASE
                                WHEN (SELECT COUNT(*) FROM PropertyRooms) > 0
                                    THEN jsonb_agg(PropertyRooms)
                                ELSE '[]'::jsonb
                            END AS "Results"
                        FROM PropertyRooms
                """;

        var queryFinal = FormattableStringFactory.Create(queryBuild);

        return await dbContext
            .Database
            .SqlQuery<NpgsqlPaginatedResult<PropertyRoom>>(queryFinal)
            .FirstAsync(cancellationToken);
    }
}
