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
        var whereClause = $@"
            WHERE (p.""Location"" ILIKE '%{query.PropertyFiltersMandatory.Location}%' OR p.""Name"" ILIKE '%{query.PropertyFiltersMandatory.Location}%')
            AND r.""AdultCapacity"" >= {query.PropertyFiltersMandatory.NumberOfAdults}
            AND r.""ChildrenCapacity"" >= {query.PropertyFiltersMandatory.NumberOfChildren}
            AND NOT EXISTS (
                SELECT 1 
                FROM ""Booking""
                WHERE ""Booking"".""RoomId"" = r.""Id""
                AND NOT (""Booking"".""StartDate"" >= '{query.PropertyFiltersMandatory.EndDate}' OR ""Booking"".""EndDate"" <= '{query.PropertyFiltersMandatory.StartDate}')
            )";

        if (query.PropertyFiltersOptional.LoggedUserId == null)
        {
            query.PropertyFiltersOptional.LoggedUserId = Guid.Empty;
        }

        if (query.PropertyFiltersOptional.HasFreeWiFi)
        {
            whereClause += " AND p.\"HasFreeWiFi\" = TRUE";
        }

        if (query.PropertyFiltersOptional.HasParking)
        {
            whereClause += " AND p.\"HasParking\" = TRUE";
        }

        if (query.PropertyFiltersOptional.HasRestaurant)
        {
            whereClause += " AND p.\"HasRestaurant\" = TRUE";
        }

        if (query.PropertyFiltersOptional.HasBreakfast)
        {
            whereClause += " AND p.\"HasBreakfast\" = TRUE";
        }

        if (query.PropertyFiltersOptional.HasKitchen)
        {
            whereClause += " AND p.\"HasKitchen\" = TRUE";
        }

        if (query.PropertyFiltersOptional.HasPool)
        {
            whereClause += " AND p.\"HasPool\" = TRUE";
        }

        if (query.PropertyFiltersOptional.HasFitnessCenter)
        {
            whereClause += " AND p.\"HasFitnessCenter\" = TRUE";
        }

        if (query.PropertyFiltersOptional.HasPetFriendlyPolicy)
        {
            whereClause += " AND p.\"HasPetFriendlyPolicy\" = TRUE";
        }

        if (query.PropertyFiltersOptional.HasFreeCancellation)
        {
            whereClause += " AND p.\"HasFreeCancellation\" = TRUE";
        }

        if (query.PropertyFiltersOptional.HasPrivateBathroom)
        {
            whereClause += " AND r.\"HasPrivateBathroom\" = TRUE";
        }

        if (query.PropertyFiltersOptional.HasHairdryer)
        {
            whereClause += " AND r.\"HasHairdryer\" = TRUE";
        }

        if (query.PropertyFiltersOptional.HasBalcony)
        {
            whereClause += " AND r.\"HasBalcony\" = TRUE";
        }

        if (query.PropertyFiltersOptional.HasSeaView)
        {
            whereClause += " AND r.\"HasSeaView\" = TRUE";
        }

        if (query.PropertyFiltersOptional.HasRefrigerator)
        {
            whereClause += " AND r.\"HasRefrigerator\" = TRUE";
        }

        if (query.PropertyFiltersOptional.Over1000 || query.PropertyFiltersOptional.Between500and1000 || query.PropertyFiltersOptional.Between250and500 || query.PropertyFiltersOptional.Under250)
        {
            whereClause += " AND (1=0";
            string discountClause = "(r.\"Price\" * (1 - COALESCE(d.\"DiscountPercentage\", 0) / 100.0))";

            if (query.PropertyFiltersOptional.Over1000)
            {
                whereClause += $" OR {discountClause} >= 1000";
            }

            if (query.PropertyFiltersOptional.Between500and1000)
            {
                whereClause += $" OR ({discountClause} >= 500 AND {discountClause} <= 1000)";
            }

            if (query.PropertyFiltersOptional.Between250and500)
            {
                whereClause += $" OR ({discountClause} >= 250 AND {discountClause} <= 500)";
            }

            if (query.PropertyFiltersOptional.Under250)
            {
                whereClause += $" OR {discountClause} <= 250";
            }

            whereClause += ")";
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

        var queryBuild = $@"
            WITH PropertySummaries AS (
                SELECT
                    p.""Id"",
                    p.""Name"",
                    p.""Location"",
                    p.""Rating"",
                    p.""HasFreeCancellation"",
                    p.""PrepaymentNeeded"",
                    json_agg(DISTINCT r.""Type"") AS ""TypeOfRooms"",
                    COUNT(DISTINCT r.""Id"") AS ""AvailableRooms"",
                    AVG(re.""Rating"") AS ""ReviewRating"",
                    COUNT(DISTINCT re.""Id"") AS ""TotalReviews"",
                    (MIN(r.""Price"") * {(query.PropertyFiltersMandatory.EndDate - query.PropertyFiltersMandatory.StartDate).Value.Days}) AS ""TotalPrice"",
                    {(query.PropertyFiltersMandatory.EndDate - query.PropertyFiltersMandatory.StartDate).Value.Days} AS ""NightCount"",
                    {query.PropertyFiltersMandatory.NumberOfAdults} AS ""AdultCount"",
                    {query.PropertyFiltersMandatory.NumberOfChildren} AS ""ChildrenCount"",
                    {query.PropertyFiltersMandatory.NumberOfRooms} AS ""RoomCount"",
                    split_part(p.""PictureUrls"", ';', 1) AS ""ImageUrl"",
                    COALESCE(d.""DiscountPercentage"", 0) AS ""DiscountPercentage"",
                    p.""CreatedOn"",
                    ROW_NUMBER() OVER (ORDER BY p.""CreatedOn"" DESC) AS ""RowNumber""
                FROM
                    ""Property"" AS p
                JOIN
                    ""Room"" AS r
                ON
                    p.""Id"" = r.""PropertyId""
                LEFT JOIN
                    ""Review"" AS re
                ON
                    p.""Id"" = re.""PropertyId""
                LEFT JOIN 
                    ""Discount"" AS d
                ON 
                    d.""PropertyId"" = p.""Id"" AND d.""UserId"" = '{query.PropertyFiltersOptional.LoggedUserId}' AND '{DateTime.UtcNow}' <= d.""EndDate""
                {whereClause}
                GROUP BY
                    p.""Id"",
                    p.""Name"",
                    p.""Location"",
                    p.""Rating"",
                    p.""HasFreeCancellation"",
                    p.""CreatedOn"",
                    d.""DiscountPercentage""
                {havingClause}
                ORDER BY
                    p.""CreatedOn"" DESC
                OFFSET {query.From} ROWS FETCH NEXT {query.To - query.From} ROWS ONLY
            )
            SELECT
                CASE
                    WHEN (
                        SELECT COUNT(DISTINCT p.""Id"") 
                        FROM ""Property"" AS p 
                        JOIN ""Room"" AS r ON r.""PropertyId"" = p.""Id""
                        LEFT JOIN ""Review"" AS re ON re.""PropertyId"" = p.""Id""
                        LEFT JOIN 
                            ""Discount"" AS d
                        ON 
                            d.""PropertyId"" = p.""Id"" AND d.""UserId"" = '{query.PropertyFiltersOptional.LoggedUserId}' AND '{DateTime.UtcNow}' <= d.""EndDate""
                        {whereClause}
                        {havingClause}
                    ) IS NULL THEN 0
                    ELSE (
                        SELECT COUNT(DISTINCT p.""Id"") 
                        FROM ""Property"" AS p 
                        JOIN ""Room"" AS r ON r.""PropertyId"" = p.""Id""
                        LEFT JOIN ""Review"" AS re ON re.""PropertyId"" = p.""Id""
                        LEFT JOIN 
                            ""Discount"" AS d
                        ON 
                            d.""PropertyId"" = p.""Id"" AND d.""UserId"" = '{query.PropertyFiltersOptional.LoggedUserId}' AND '{DateTime.UtcNow}' <= d.""EndDate""
                        {whereClause}
                        {havingClause}
                    )
                END AS ""TotalCount"",
                    CASE
                        WHEN (SELECT COUNT(*) FROM PropertySummaries) > 0
                            THEN jsonb_agg(PropertySummaries)
                        ELSE '[]'::jsonb
                    END AS ""Results""
                FROM PropertySummaries
            ";

        var queryFinal = FormattableStringFactory.Create(queryBuild);

        return await dbContext
            .Database
            .SqlQuery<NpgsqlPaginatedResult<PropertySummaryFiltered>>(queryFinal)
            .FirstAsync(cancellationToken);
    }
}
