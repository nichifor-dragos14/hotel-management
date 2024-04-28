using HotelManagement.Core.Abstractions;
using HotelManagement.Core.Properties;
using Microsoft.EntityFrameworkCore;

namespace HotelManagement.Infrastructure.EntityFramework.Queries;

internal class AllPropertySummariesQueryHandler(
    ApplicationDbContext dbContext
) : IQueryHandler<AllPropertySummariesQuery, IPaginatedResult<PropertySummary>>
{
    public async Task<IPaginatedResult<PropertySummary>> ExecuteAsync(
        AllPropertySummariesQuery query, 
        CancellationToken cancellationToken
        )
    {
        return await dbContext
            .Database
            .SqlQuery<NpgsqlPaginatedResult<PropertySummary>>(
                $"""
                    WITH PropertySummaries AS (
                        SELECT
                            p."Id",
                            p."Name",
                            p."Location",
                            p."CreatedOn",
                            (SELECT COUNT(r."Id") FROM "Room" AS r WHERE r."PropertyId" = p."Id") AS "NumberOfRooms",
                            ROW_NUMBER() OVER (ORDER BY p."CreatedOn" DESC) AS "RowNumber"
                        FROM
                            "Property" AS p
                        ORDER BY
                            p."CreatedOn" DESC
                        OFFSET {query.From} ROWS FETCH NEXT {query.To - query.From} ROWS ONLY
                    )
                    SELECT
                        (SELECT COUNT(*) FROM "Property") as "TotalCount",
                            CASE
                                WHEN (SELECT COUNT(*) FROM PropertySummaries) > 0
                                    THEN jsonb_agg(PropertySummaries)
                                ELSE '[]'::jsonb
                            END AS "Results"
                        FROM PropertySummaries
                """
            )
            .FirstAsync(cancellationToken);
    }
}
