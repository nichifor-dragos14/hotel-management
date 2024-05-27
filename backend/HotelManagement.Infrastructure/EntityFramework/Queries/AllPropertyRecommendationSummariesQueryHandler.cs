using HotelManagement.Core.Abstractions;
using HotelManagement.Core.Properties;
using Microsoft.EntityFrameworkCore;
using System.Runtime.CompilerServices;

namespace HotelManagement.Infrastructure.EntityFramework.Queries;

internal class AllPropertyRecommendationSummariesQueryHandler(
    ApplicationDbContext dbContext
) : IQueryHandler<AllPropertyRecommendationSummariesQuery, IPaginatedResult<PropertySummaryRecommendation>>
{
    public async Task<IPaginatedResult<PropertySummaryRecommendation>> ExecuteAsync(
        AllPropertyRecommendationSummariesQuery query,
        CancellationToken cancellationToken
        )
    {
        var whereClause = "";

        foreach (var search in query.SearchHistory) {
            if (whereClause == "")
            {
                whereClause += $"WHERE p.\"Location\" ILIKE '%{search.Location}%'" +
                    $"OR r.\"NumberOfChildren\" >= {search.NumberOfChildren}" +
                    $"OR r.\"NumberOfAdults\" >= {search.NumberOfAdults}" +
                    $"OR r.\"NumberOfRooms\" >= {search.NumberOfRooms}";
            }
            else
            {
                whereClause += $"OR WHERE p.\"Location\" ILIKE '%{search.Location}%'" +
                    $"OR r.\"NumberOfChildren\" >= {search.NumberOfChildren}" +
                    $"OR r.\"NumberOfAdults\" >= {search.NumberOfAdults}" +
                    $"OR r.\"NumberOfRooms\" >= {search.NumberOfRooms}";
            }
        }

        Guid userId = Guid.Empty;

        if (query.LoggedUserId != null)
        {
            userId = (Guid)query.LoggedUserId;
        }


        var queryBuild = $"""
                   WITH PropertySummaries AS (
                    SELECT
                        p."Id",
                        p."Name",
                        p."Location",
                        p."Rating",
                        p."HasFreeCancellation",
                        p."PrepaymentNeeded",
                        json_agg(DISTINCT r."Type") AS "TypeOfRooms",
                        COUNT(DISTINCT r."Id") AS "AvailableRooms",
                        AVG(re."Rating") AS "ReviewRating",
                        COUNT(DISTINCT re."Id") AS "TotalReviews",         
                        split_part(p."PictureUrls", ';', 1) AS "ImageUrl",
                        COALESCE(d."DiscountPercentage", 0) AS "DiscountPercentage",
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
                        "Discount" AS d
                    ON 
                        d."PropertyId" = p."Id" AND d."UserId" = '{userId}' AND '{DateTime.UtcNow}' <= d."EndDate"
                    {whereClause}
                    GROUP BY
                        p."Id",
                        p."Name",
                        p."Location",
                        p."Rating",
                        p."HasFreeCancellation",
                        p."CreatedOn",
                        d."DiscountPercentage"
                    ORDER BY
                        p."CreatedOn" DESC
                    LIMIT 100
                ),
                LimitedPropertySummaries AS (
                    SELECT * FROM PropertySummaries
                    OFFSET {query.From} ROWS FETCH NEXT {query.To - query.From} ROWS ONLY
                )
                SELECT
                    (SELECT COUNT(*) FROM PropertySummaries) AS "TotalCount",
                    CASE
                        WHEN (SELECT COUNT(*) FROM LimitedPropertySummaries) > 0
                            THEN jsonb_agg(LimitedPropertySummaries)
                        ELSE '[]'::jsonb
                    END AS "Results"
                FROM LimitedPropertySummaries
                """;

        var queryFinal = FormattableStringFactory.Create(queryBuild);

        return await dbContext
            .Database
            .SqlQuery<NpgsqlPaginatedResult<PropertySummaryRecommendation>>(queryFinal)
            .FirstAsync(cancellationToken);
    }
}
