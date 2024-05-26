using HotelManagement.Core.Abstractions;
using HotelManagement.Core.Reports;
using Microsoft.EntityFrameworkCore;

namespace HotelManagement.Infrastructure.EntityFramework.Queries;

internal class AllClosedReportSummariesQueryHandler(
    ApplicationDbContext dbContext
) : IQueryHandler<AllClosedReportSummariesQuery, IPaginatedResult<ReportSummary>>
{
    public async Task<IPaginatedResult<ReportSummary>> ExecuteAsync(
        AllClosedReportSummariesQuery query,
        CancellationToken cancellationToken
        )
    {
        return await dbContext
            .Database
            .SqlQuery<NpgsqlPaginatedResult<ReportSummary>>(
                $"""
                    WITH ReportSummaries AS (
                        SELECT
                            r."Id",
                            r."Title",
                            r."IsRead",
                            r."IsClosed",
                            p."Name" AS "PropertyName",
                            r."CreatedOn",
                            ROW_NUMBER() OVER (ORDER BY r."CreatedOn" DESC) AS "RowNumber"
                        FROM
                            "Report" AS r
                        LEFT JOIN
                            "Property" AS p
                        ON
                            r."PropertyId" = p."Id"
                        WHERE r."IsClosed" = True
                        ORDER BY
                            r."CreatedOn" DESC
                        OFFSET {query.From} ROWS FETCH NEXT {query.To - query.From} ROWS ONLY
                    )
                    SELECT
                        (SELECT COUNT(*) FROM "Report" AS r WHERE r."IsClosed" = True) as "TotalCount",
                            CASE
                                WHEN (SELECT COUNT(*) FROM ReportSummaries) > 0
                                    THEN jsonb_agg(ReportSummaries)
                                ELSE '[]'::jsonb
                            END AS "Results"
                        FROM ReportSummaries
                """
            )
            .FirstAsync(cancellationToken);
    }
}
