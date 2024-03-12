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
        var whereClause = "";
        var havingClause = "";

        if (query.PropertyFiltersOptional.HasFreeWiFi)
        {
            whereClause += "WHERE p.\"HasFreeWiFi\" = True";
        }

        if (query.PropertyFiltersOptional.HasParking)
        {
            if (whereClause == "")
            {
                whereClause += "WHERE p.\"HasParking\" = True";
            }
            else
            {
                whereClause += " AND p.\"HasParking\" = True";
            }
        }

        if (query.PropertyFiltersOptional.HasRestaurant)
        {
            if (whereClause == "")
            {
                whereClause += "WHERE p.\"HasRestaurant\" = True";
            }
            else
            {
                whereClause += " AND p.\"HasRestaurant\" = True";
            }
        }

        if (query.PropertyFiltersOptional.HasBreakfast)
        {
            if (whereClause == "")
            {
                whereClause += "WHERE p.\"HasBreakfast\" = True";
            }
            else
            {
                whereClause += " AND p.\"HasBreakfast\" = True";
            }
        }

        if (query.PropertyFiltersOptional.HasKitchen)
        {
            if (whereClause == "")
            {
                whereClause += "WHERE p.\"HasKitchen\" = True";
            }
            else
            {
                whereClause += " AND p.\"HasKitchen\" = True";
            }
        }

        if (query.PropertyFiltersOptional.HasPool)
        {
            if (whereClause == "")
            {
                whereClause += "WHERE p.\"HasPool\" = True";
            }
            else
            {
                whereClause += " AND p.\"HasPool\" = True";
            }
        }

        if (query.PropertyFiltersOptional.HasFitnessCenter)
        {
            if (whereClause == "")
            {
                whereClause += "WHERE p.\"HasFitnessCenter\" = True";
            }
            else
            {
                whereClause += " AND p.\"HasFitnessCenter\" = True";
            }
        }

        if (query.PropertyFiltersOptional.HasPetFriendlyPolicy)
        {
            if (whereClause == "")
            {
                whereClause += "WHERE p.\"HasPetFriendlyPolicy\" = True";
            }
            else
            {
                whereClause += " AND p.\"HasPetFriendlyPolicy\" = True";
            }
        }

        if (query.PropertyFiltersOptional.HasFreeCancellation)
        {
            if (whereClause == "")
            {
                whereClause += "WHERE p.\"HasFreeCancellation\" = True";
            }
            else
            {
                whereClause += " AND p.\"HasFreeCancellation\" = True";
            }
        }

        if (query.PropertyFiltersOptional.HasPrivateBathroom)
        {
            if (whereClause == "")
            {
                whereClause += "WHERE r.\"HasPrivateBathroom\" = True";
            }
            else
            {
                whereClause += " AND r.\"HasPrivateBathroom\" = True";
            }
        }

        if (query.PropertyFiltersOptional.HasHairdryer)
        {
            if (whereClause == "")
            {
                whereClause += "WHERE r.\"HasHairdryer\" = True";
            }
            else
            {
                whereClause += " AND r.\"HasHairdryer\" = True";
            }
        }

        if (query.PropertyFiltersOptional.HasBalcony)
        {
            if (whereClause == "")
            {
                whereClause += "WHERE r.\"HasBalcony\" = True";
            }
            else
            {
                whereClause += " AND r.\"HasBalcony\" = True";
            }
        }

        if (query.PropertyFiltersOptional.HasSeaView)
        {
            if (whereClause == "")
            {
                whereClause += "WHERE r.\"HasSeaView\" = True";
            }
            else
            {
                whereClause += " AND r.\"HasSeaView\" = True";
            }
        }

        if (query.PropertyFiltersOptional.HasRefrigerator)
        {
            if (whereClause == "")
            {
                whereClause += "WHERE r.\"HasRefrigerator\" = True";
            }
            else
            {
                whereClause += " AND r.\"HasRefrigerator\" = True";
            }
        }

        if (query.PropertyFiltersOptional.RatingOver6)
        {
            havingClause += "HAVING AVG(re.\"Rating\") > 6";
        }
        else if (query.PropertyFiltersOptional.RatingOver7)
        {
            havingClause += "HAVING AVG(re.\"Rating\") > 7";
     
        }
        else if (query.PropertyFiltersOptional.RatingOver8)
        {
            havingClause += "HAVING AVG(re.\"Rating\") > 8";
        }
        else if (query.PropertyFiltersOptional.RatingOver9)
        {
            havingClause += "HAVING AVG(re.\"Rating\") > 9";
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
                            r."Type" AS "TypeOfRoom",
                            COUNT(r."Id") AS "AvailableRooms",
                            AVG(re."Rating") AS "ReviewRating",
                            COUNT(re."Id") AS "TotalReviews",
                            (r."Price" * {(query.PropertyFiltersMandatory.EndDate - query.PropertyFiltersMandatory.StartDate).Value.Days}) AS "TotalPrice",
                            {(query.PropertyFiltersMandatory.EndDate - query.PropertyFiltersMandatory.StartDate).Value.Days} AS "NightCount",
                            {query.PropertyFiltersMandatory.NumberOfAdults} AS "AdultCount",
                            {query.PropertyFiltersMandatory.NumberOfChildren} AS "ChildrenCount",
                            {query.PropertyFiltersMandatory.NumberOfRooms} AS "RoomCount",
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
                        {whereClause}
                        GROUP BY
                            p."Id",
                            p."Name",
                            p."Location",
                            p."Rating",
                            p."HasFreeCancellation",
                            r."Type",
                            r."Price",
                            p."CreatedOn"
                        {havingClause}
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
                """;
        
        var queryFinal = FormattableStringFactory.Create(queryBuild);

        return await dbContext
            .Database
            .SqlQuery<NpgsqlPaginatedResult<PropertySummaryFiltered>>(queryFinal)
            .FirstAsync(cancellationToken);
    }
}
