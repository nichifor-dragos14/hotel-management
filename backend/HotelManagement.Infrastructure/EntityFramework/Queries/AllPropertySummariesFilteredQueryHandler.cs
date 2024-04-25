using HotelManagement.Core.Abstractions;
using HotelManagement.Core.Properties;
using Microsoft.EntityFrameworkCore;
using System.Runtime.CompilerServices;

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
        var whereClause = $"WHERE p.\"Location\" ILIKE '%{query.PropertyFiltersMandatory.Location}%'" +
            $" AND r.\"AdultCapacity\" >= {query.PropertyFiltersMandatory.NumberOfAdults}" +
            $" AND r.\"ChildrenCapacity\" >= {query.PropertyFiltersMandatory.NumberOfChildren}" +
            $" AND NOT EXISTS (SELECT 1 FROM \"Booking\"" +
            $"                 WHERE \"Booking\".\"RoomId\" = r.\"Id\"" +
            $"                 AND NOT (\"Booking\".\"StartDate\" >= '{query.PropertyFiltersMandatory.EndDate}' OR \"Booking\".\"EndDate\" <= '{query.PropertyFiltersMandatory.StartDate}'))";

        if (query.PropertyFiltersOptional.HasFreeWiFi)
        {
            whereClause += " AND p.\"HasFreeWiFi\" = True";
        }

        if (query.PropertyFiltersOptional.HasParking)
        {
            whereClause += " AND p.\"HasParking\" = True";
        }

        if (query.PropertyFiltersOptional.HasRestaurant)
        {
            whereClause += " AND p.\"HasRestaurant\" = True";
        }

        if (query.PropertyFiltersOptional.HasBreakfast)
        {
            whereClause += " AND p.\"HasBreakfast\" = True";
        }

        if (query.PropertyFiltersOptional.HasKitchen)
        {
            whereClause += " AND p.\"HasKitchen\" = True";
        }

        if (query.PropertyFiltersOptional.HasPool)
        {
            whereClause += " AND p.\"HasPool\" = True";
        }

        if (query.PropertyFiltersOptional.HasFitnessCenter)
        {
            whereClause += " AND p.\"HasFitnessCenter\" = True";
        }

        if (query.PropertyFiltersOptional.HasPetFriendlyPolicy)
        {
            whereClause += " AND p.\"HasPetFriendlyPolicy\" = True";
        }

        if (query.PropertyFiltersOptional.HasFreeCancellation)
        {
            whereClause += " AND p.\"HasFreeCancellation\" = True";
        }

        if (query.PropertyFiltersOptional.HasPrivateBathroom)
        {
            whereClause += " AND r.\"HasPrivateBathroom\" = True";
        }

        if (query.PropertyFiltersOptional.HasHairdryer)
        {
            whereClause += " AND r.\"HasHairdryer\" = True";
        }

        if (query.PropertyFiltersOptional.HasBalcony)
        {
            whereClause += " AND r.\"HasBalcony\" = True";
        }

        if (query.PropertyFiltersOptional.HasSeaView)
        {
            whereClause += " AND r.\"HasSeaView\" = True";
        }

        if (query.PropertyFiltersOptional.HasRefrigerator)
        {
            whereClause += " AND r.\"HasRefrigerator\" = True";
        }

        var havingClause = "";

        if (query.PropertyFiltersOptional.RatingOver6)
        {
            havingClause += "HAVING AVG(re.\"Rating\") >= 6";
        }
        else if (query.PropertyFiltersOptional.RatingOver7)
        {
            havingClause += "HAVING AVG(re.\"Rating\") >= 7";

        }
        else if (query.PropertyFiltersOptional.RatingOver8)
        {
            havingClause += "HAVING AVG(re.\"Rating\") >= 8";
        }
        else if (query.PropertyFiltersOptional.RatingOver9)
        {
            havingClause += "HAVING AVG(re.\"Rating\") >= 9";
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
                            (MIN(r."Price") * {(query.PropertyFiltersMandatory.EndDate - query.PropertyFiltersMandatory.StartDate).Value.Days}) AS "TotalPrice",
                            {(query.PropertyFiltersMandatory.EndDate - query.PropertyFiltersMandatory.StartDate).Value.Days} AS "NightCount",
                            {query.PropertyFiltersMandatory.NumberOfAdults} AS "AdultCount",
                            {query.PropertyFiltersMandatory.NumberOfChildren} AS "ChildrenCount",
                            {query.PropertyFiltersMandatory.NumberOfRooms} AS "RoomCount",
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
                        {havingClause}
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
                                {havingClause}
                            ) IS NULL THEN 0
                            ELSE (
                                SELECT COUNT(DISTINCT p."Id") 
                                FROM "Property" AS p 
                                JOIN "Room" AS r ON r."PropertyId" = p."Id"
                                LEFT JOIN "Review" AS re ON re."PropertyId" = p."Id"
                                {whereClause}
                                {havingClause}
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
            .SqlQuery<NpgsqlPaginatedResult<PropertySummaryFiltered>>(queryFinal)
            .FirstAsync(cancellationToken);
    }
}
