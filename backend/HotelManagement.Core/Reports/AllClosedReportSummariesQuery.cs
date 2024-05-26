using HotelManagement.Core.Abstractions;

namespace HotelManagement.Core.Reports;

public record ReportSummary(
    Guid Id,
    string Title,
    bool IsRead,
    bool IsClosed,
    string PropertyName,
    DateTime CreatedOn,
    int RowNumber
);

public record AllClosedReportSummariesQuery(
    int From, 
    int To
) : IQuery<IPaginatedResult<ReportSummary>>;