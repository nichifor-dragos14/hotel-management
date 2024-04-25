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
                        {whereClause}
                        GROUP BY
                            p."Id",
                            p."Name",
                            p."Location",
                            p."Rating",
                            p."HasFreeCancellation",
                            p."CreatedOn"
                        ORDER BY
                            p."CreatedOn" DESC
                        OFFSET {query.From} ROWS FETCH NEXT {query.To - query.From} ROWS ONLY
                    )
                    SELECT
                        CASE
                            WHEN (
                                SELECT COUNT(DISTINCT p."Id") 
                                FROM "Property" AS p 
                                JOIN "Room" AS r ON r."PropertyId" = p."Id"
                                LEFT JOIN "Review" AS re ON re."PropertyId" = p."Id"
                                {whereClause}
                            ) IS NULL THEN 0
                            ELSE (
                                SELECT COUNT(DISTINCT p."Id") 
                                FROM "Property" AS p 
                                JOIN "Room" AS r ON r."PropertyId" = p."Id"
                                LEFT JOIN "Review" AS re ON re."PropertyId" = p."Id"
                                {whereClause}
                            )
                        END AS "TotalCount",
                            CASE
                                WHEN (SELECT COUNT(*) FROM PropertySummaries) > 0
                                    THEN jsonb_agg(PropertySummaries)
                                ELSE '[]'::jsonb
                            END AS "Results"
                        FROM PropertySummaries
                """;

        var queryFinal = FormattableStringFactory.Create(queryBuild);

        return await dbContext
            .Database
            .SqlQuery<NpgsqlPaginatedResult<PropertySummaryRecommendation>>(queryFinal)
            .FirstAsync(cancellationToken);
    }
}
