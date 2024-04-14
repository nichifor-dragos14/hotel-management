using HotelManagement.Core.Abstractions;

namespace HotelManagement.Core.Bookings;

public record BookingSummary(
    Guid Id,
    string StartDate,
    string EndDate,
    string PropertyName,
    string Location,
    int RowNumber
);

public record AllPastBookingSummariesQuery(Guid UserId, int From, int To) : IQuery<IPaginatedResult<BookingSummary>>;

