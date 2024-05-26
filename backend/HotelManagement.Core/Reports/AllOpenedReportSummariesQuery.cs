using HotelManagement.Core.Abstractions;

namespace HotelManagement.Core.Reports;

public record AllOpenedReportSummariesQuery(
    int From,
    int To
) : IQuery<IPaginatedResult<ReportSummary>>;