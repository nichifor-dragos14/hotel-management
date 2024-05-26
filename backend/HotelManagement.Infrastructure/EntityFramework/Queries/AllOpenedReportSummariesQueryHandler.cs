using HotelManagement.Core.Abstractions;
using HotelManagement.Core.Reports;
using Microsoft.EntityFrameworkCore;

namespace HotelManagement.Infrastructure.EntityFramework.Queries;

internal class AllOpenedReportSummariesQueryHandler(
    ApplicationDbContext dbContext
) : IQueryHandler<AllOpenedReportSummariesQuery, IPaginatedResult<ReportSummary>>
{
    public async Task<IPaginatedResult<ReportSummary>> ExecuteAsync(
        AllOpenedReportSummariesQuery query,
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
                        WHERE r."IsClosed" = False
                        ORDER BY
                            r."CreatedOn" DESC
                        OFFSET {query.From} ROWS FETCH NEXT {query.To - query.From} ROWS ONLY
                    )
                    SELECT
                        (SELECT COUNT(*) FROM "Report" AS r WHERE r."IsClosed" = False) as "TotalCount",
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
