using HotelManagement.Core.Abstractions;
using HotelManagement.Core.Properties;
using Microsoft.EntityFrameworkCore;

namespace HotelManagement.Infrastructure.EntityFramework.Queries;

internal class AllPropertyReviewsQueryHandler(
    ApplicationDbContext dbContext
) : IQueryHandler<AllPropertyReviewsQuery, IPaginatedResult<PropertyReview>>
{
    public async Task<IPaginatedResult<PropertyReview>> ExecuteAsync(
        AllPropertyReviewsQuery query, 
        CancellationToken cancellationToken
        )
    {
        return await dbContext
            .Database
            .SqlQuery<NpgsqlPaginatedResult<PropertyReview>>(
                $"""
                    WITH PropertyReviews AS (
                        SELECT
                            r."Id",
                            r."Title",
                            r."Description",
                            r."Rating",
                            r."CreatedOn",
                            r."UpdatedOn",
                            u."FirstName" as "UserFirstName",
                            u."LastName" as "UserLastName",
                            u."Nationality" as "UserNationality",
                            ROW_NUMBER() OVER (ORDER BY r."CreatedOn" DESC) AS "RowNumber"
                        FROM
                            "Review" AS r
                        JOIN 
                            "User" AS u
                        ON
                            u."Id" = r."UserId"  
                        WHERE r."PropertyId" = {query.Id}
                        ORDER BY
                            r."CreatedOn" DESC
                        OFFSET {query.From} ROWS FETCH NEXT {query.To - query.From} ROWS ONLY
                    )
                    SELECT
                        (SELECT COUNT(*) 
                        FROM "Review" AS r
                        JOIN "User" AS u ON u."Id" = r."UserId"
                        WHERE r."PropertyId" = {query.Id}
                        ) as "TotalCount",
                            CASE
                                WHEN (SELECT COUNT(*) FROM PropertyReviews) > 0
                                    THEN jsonb_agg(PropertyReviews)
                                ELSE '[]'::jsonb
                            END AS "Results"
                        FROM PropertyReviews
                """
            )
            .FirstAsync(cancellationToken);
    }
}
