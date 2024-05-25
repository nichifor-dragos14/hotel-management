using HotelManagement.Core.Abstractions;

namespace HotelManagement.Core.Properties;

public record AllUpcomingPropertyBookingsQuery(
    int From,
    int To,
    Guid Id
) : IQuery<IPaginatedResult<PropertyBooking>>;