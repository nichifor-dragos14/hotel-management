using HotelManagement.Core.Abstractions;
using HotelManagement.Core.Properties;
using Microsoft.EntityFrameworkCore;

namespace HotelManagement.Infrastructure.EntityFramework.Queries;

internal class AllUpcomingPropertyBookingsQueryHandler(
    ApplicationDbContext dbContext
) : IQueryHandler<AllUpcomingPropertyBookingsQuery, IPaginatedResult<PropertyBooking>>
{
    public async Task<IPaginatedResult<PropertyBooking>> ExecuteAsync(
        AllUpcomingPropertyBookingsQuery query,
        CancellationToken cancellationToken
        )
    {
        return await dbContext
            .Database
            .SqlQuery<NpgsqlPaginatedResult<PropertyBooking>>(
                $"""
                    WITH PropertyPastBookings AS (
                        SELECT
                            b."Id",
                            b."StartDate",
                            b."EndDate",
                            b."TotalPrice",
                            u."FirstName" AS "FirstNameOnBooking",
                            u."LastName" AS "LastNameOnBooking",
                            ROW_NUMBER() OVER (ORDER BY b."CreatedOn" DESC) AS "RowNumber"
                        FROM
                            "Booking" AS b
                        LEFT JOIN 
                            "User" AS u ON u."Id" = b."UserId"
                        LEFT JOIN
                            "Room" AS r ON r."Id" = b."RoomId"
                        LEFT JOIN
                            "Property" AS p ON p."Id" = r."PropertyId"
                        WHERE b."EndDate" > NOW() AND p."Id" = {query.Id}
                        ORDER BY
                            b."CreatedOn" DESC
                        OFFSET {query.From} ROWS FETCH NEXT {query.To - query.From} ROWS ONLY
                    )
                    SELECT
                        (SELECT COUNT(*)
                        FROM "Booking"
                        LEFT JOIN "Room" ON "Room"."Id" = "Booking"."RoomId"
                        LEFT JOIN "Property" ON "Property"."Id" = "Room"."PropertyId"
                        WHERE "Booking"."EndDate" > NOW() AND "Property"."Id" = {query.Id}
                        ) as "TotalCount",
                            CASE
                                WHEN (SELECT COUNT(*) FROM PropertyPastBookings) > 0
                                    THEN jsonb_agg(PropertyPastBookings)
                                ELSE '[]'::jsonb
                            END AS "Results"
                        FROM PropertyPastBookings
                """
            )
            .FirstAsync(cancellationToken);
    }
}
