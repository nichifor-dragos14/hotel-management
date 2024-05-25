using HotelManagement.Core.Abstractions;

namespace HotelManagement.Core.Properties;

public record PropertyBooking(
    Guid Id,
    DateTime StartDate,
    DateTime EndDate,
    double TotalPrice,
    string FirstNameOnBooking,
    string LastNameOnBooking,
    int RowNumber
);
              
public record AllPastPropertyBookingsQuery(
    int From,
    int To,
    Guid Id
) : IQuery<IPaginatedResult<PropertyBooking>>;