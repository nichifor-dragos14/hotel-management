using HotelManagement.Core.Abstractions;

namespace HotelManagement.Core.Reports;

public record ReportDetails(
    Guid Id,
    string Title,
    string Description,
    bool IsRead,
    DateTime CreatedOn,
    DateTime UpdatedOn
);

public record OneReportQuery(Guid? Id) : IQuery<ReportDetails>;

internal class OneReportQueryHandler(
    IQueryFacade facade
) : IQueryHandler<OneReportQuery, ReportDetails>
{
    public async Task<ReportDetails> ExecuteAsync(
        OneReportQuery query,
        CancellationToken cancellationToken
    )
    {
        return
            (from report in facade.Of<Report>()
             where report.Id == query.Id
             select new ReportDetails(
                 report.Id,
                 report.Title,
                 report.Description,
                 report.IsRead,
                 report.CreatedOn,
                 report.UpdatedOn
             )
            ).FirstOrDefault();
    }
}