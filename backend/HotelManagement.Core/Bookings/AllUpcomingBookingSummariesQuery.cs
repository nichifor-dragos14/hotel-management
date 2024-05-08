using HotelManagement.Core.Abstractions;

namespace HotelManagement.Core.Bookings;

public record AllUpcomingBookingSummariesQuery(
    Guid UserId, 
    int From,
    int To
) : IQuery<IPaginatedResult<BookingSummary>>;