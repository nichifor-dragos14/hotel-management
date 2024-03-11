﻿using HotelManagement.Core.Abstractions;
using HotelManagement.Core.Properties;
using Microsoft.EntityFrameworkCore;

namespace HotelManagement.Infrastructure.EntityFramework.Queries;

internal class AllPropertySummariesFilteredQueryHandler(
    ApplicationDbContext dbContext
) : IQueryHandler<AllPropertySummariesFilteredQuery, IPaginatedResult<PropertySummaryFiltered>>
{
    public async Task<IPaginatedResult<PropertySummaryFiltered>> ExecuteAsync(
        AllPropertySummariesFilteredQuery query,
        CancellationToken cancellationToken
        )
    {
        return await dbContext
            .Database
            .SqlQuery<NpgsqlPaginatedResult<PropertySummaryFiltered>>($"""
                    WITH PropertySummaries AS (
                        SELECT
                            p."Id",
                            p."Name",
                            p."Location",
                            p."Rating",
                            p."HasFreeCancellation",
                            p."PrepaymentNeeded",
                            r."Type" AS "TypeOfRoom",
                            COUNT(r."Id") AS "AvailableRooms",
                            AVG(re."Rating") AS "ReviewRating",
                            COUNT(re."Id") AS "TotalReviews",
                            (r."Price" * {(query.SearchFiltersMandatory.EndDate - query.SearchFiltersMandatory.StartDate).Value.Days}) AS "TotalPrice",
                            {(query.SearchFiltersMandatory.EndDate - query.SearchFiltersMandatory.StartDate).Value.Days} AS "NightCount",
                            {query.SearchFiltersMandatory.NumberOfAdults} AS "AdultCount",
                            {query.SearchFiltersMandatory.NumberOfChildren} AS "ChildrenCount",
                            {query.SearchFiltersMandatory.NumberOfRooms} AS "RoomCount",
                            p."CreatedOn",
                            ROW_NUMBER() OVER (ORDER BY p."CreatedOn" DESC) AS "RowNumber"
                        FROM
                            "Property" AS p
                        JOIN
                            "Room" AS r
                        ON
                            p."Id" = r."PropertyId"
                        LEFT JOIN
                            "Review" AS re
                        ON
                            p."Id" = re."PropertyId"
                        LEFT JOIN
                            "Booking" AS b
                        ON
                            r."Id" = b."RoomId"
                        GROUP BY
                            p."Id",
                            p."Name",
                            p."Location",
                            p."Rating",
                            p."HasFreeCancellation",
                            r."Type",
                            r."Price",
                            p."CreatedOn"
                        ORDER BY
                            p."CreatedOn" DESC
                        OFFSET {query.From} ROWS FETCH NEXT {query.To - query.From} ROWS ONLY
                    )
                    SELECT
                        (SELECT COUNT(*) FROM PropertySummaries) as "TotalCount",
                            CASE
                                WHEN (SELECT COUNT(*) FROM PropertySummaries) > 0
                                    THEN jsonb_agg(PropertySummaries)
                                ELSE '[]'::jsonb
                            END AS "Results"
                        FROM PropertySummaries
                """)
            .FirstAsync(cancellationToken);
    }
}
