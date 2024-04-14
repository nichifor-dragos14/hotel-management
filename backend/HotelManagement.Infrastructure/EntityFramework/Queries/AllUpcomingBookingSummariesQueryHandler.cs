using HotelManagement.Core.Abstractions;
using HotelManagement.Core.Bookings;
using Microsoft.EntityFrameworkCore;

namespace HotelManagement.Infrastructure.EntityFramework.Queries;

internal class AllUpcomingBookingSummariesQueryHandler(
    ApplicationDbContext dbContext
) : IQueryHandler<AllUpcomingBookingSummariesQuery, IPaginatedResult<BookingSummary>>
{
    public async Task<IPaginatedResult<BookingSummary>> ExecuteAsync(
        AllUpcomingBookingSummariesQuery query,
        CancellationToken cancellationToken
        )
    {
        return await dbContext
            .Database
            .SqlQuery<NpgsqlPaginatedResult<BookingSummary>>(
                $"""
                    WITH BookingSummaries AS (
                        SELECT
                            b."Id",
                            b."StartDate",
                            b."EndDate",
                            p."Name" as "PropertyName",
                            p."Location",
                            ROW_NUMBER() OVER (ORDER BY b."CreatedOn" DESC) AS "RowNumber"
                        FROM
                            "Booking" AS b
                        LEFT JOIN
                            "Room" AS r ON r."Id" = b."RoomId"
                        LEFT JOIN
                            "Property" AS p ON p."Id" = r."PropertyId"
                        WHERE b."EndDate" >= NOW() AND b."UserId" = {query.UserId}
                        ORDER BY
                            b."CreatedOn" DESC
                        OFFSET {query.From} ROWS FETCH NEXT {query.To - query.From} ROWS ONLY
                    )
                    SELECT
                        (SELECT COUNT(*)
                        FROM "Booking"
                        LEFT JOIN "Room" ON "Room"."Id" = "Booking"."RoomId"
                        LEFT JOIN "Property" ON "Property"."Id" = "Room"."PropertyId"
                        WHERE "Booking"."EndDate" >= NOW() AND "Booking"."UserId" = {query.UserId}
                        ) as "TotalCount",
                            CASE
                                WHEN (SELECT COUNT(*) FROM BookingSummaries) > 0
                                    THEN jsonb_agg(BookingSummaries)
                                ELSE '[]'::jsonb
                            END AS "Results"
                        FROM BookingSummaries
                """
            )
            .FirstAsync(cancellationToken);
    }
}
