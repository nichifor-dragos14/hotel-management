using HotelManagement.Core.Abstractions;

namespace HotelManagement.Core.Reviews;

public record ReviewSummary(
    Guid Id,
    string Title,
    string Description,
    int Rating,
    DateTime CreatedOn,
    string PropertyName,
    int RowNumber
);

public record AllReviewSummariesQuery(int From, int To) : IQuery<IPaginatedResult<ReviewSummary>>;