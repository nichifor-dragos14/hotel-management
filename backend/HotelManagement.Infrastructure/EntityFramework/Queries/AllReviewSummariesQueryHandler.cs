using HotelManagement.Core.Abstractions;
using HotelManagement.Core.Reviews;
using Microsoft.EntityFrameworkCore;

namespace HotelManagement.Infrastructure.EntityFramework.Queries;

internal class AllReviewSummariesQueryHandler(
    ApplicationDbContext dbContext
) : IQueryHandler<AllReviewSummariesQuery, IPaginatedResult<ReviewSummary>>
{
    public async Task<IPaginatedResult<ReviewSummary>> ExecuteAsync(
        AllReviewSummariesQuery query,
        CancellationToken cancellationToken
        )
    {
        return await dbContext
            .Database
            .SqlQuery<NpgsqlPaginatedResult<ReviewSummary>>(
                $"""
                    WITH ReviewSummaries AS (
                        SELECT
                            r."Id",
                            r."Title",
                            r."Description",
                            r."Rating",
                            r."CreatedOn",
                            p."Name" AS "PropertyName",
                            ROW_NUMBER() OVER (ORDER BY r."CreatedOn" DESC) AS "RowNumber"
                        FROM
                            "Review" AS r
                        JOIN
                            "Property" AS p
                        ON
                            r."PropertyId" = p."Id"
                        WHERE r."UserId" = {query.UserId}
                        ORDER BY
                            r."CreatedOn" DESC
                        OFFSET {query.From} ROWS FETCH NEXT {query.To - query.From} ROWS ONLY
                    )
                    SELECT
                        (SELECT COUNT(*) FROM "Review" r WHERE r."UserId" = {query.UserId}) as "TotalCount",
                            CASE
                                WHEN (SELECT COUNT(*) FROM ReviewSummaries) > 0
                                    THEN jsonb_agg(ReviewSummaries)
                                ELSE '[]'::jsonb
                            END AS "Results"
                        FROM ReviewSummaries
                """
            )
            .FirstAsync(cancellationToken);
    }
}