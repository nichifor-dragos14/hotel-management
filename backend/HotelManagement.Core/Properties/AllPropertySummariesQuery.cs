using HotelManagement.Core.Abstractions;

namespace HotelManagement.Core.Properties;

public record PropertySummary(
    Guid Id,
    string Name,
    string Location,
    DateTime CreatedOn,
    int NumberOfRooms,
    int RowNumber
);

public record AllPropertySummariesQuery(
    int From,
    int To,
    string Name
): IQuery<IPaginatedResult<PropertySummary>>;