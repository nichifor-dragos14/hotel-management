using HotelManagement.Core.Abstractions;
using HotelManagement.Core.Properties.Filters;
using HotelManagement.Core.Rooms;

namespace HotelManagement.Core.Properties;

public record PropertySummaryFiltered(
    Guid Id,
    string Name,
    string Location,
    int Rating,
    bool HasFreeCancellation,
    bool PrepaymentNeeded,
    List<RoomType> TypeOfRooms,
    int AvailableRooms,
    double? ReviewRating,
    int? TotalReviews,
    int TotalPrice,
    int NightCount,
    int AdultCount,
    int ChildrenCount,
    int RoomCount,
    string ImageUrl,
    int DiscountPercentage,
    DateTime CreatedOn,
    int RowNumber
);

public record AllPropertySummariesFilteredQuery(
    int From,
    int To,
    PropertyFiltersMandatory PropertyFiltersMandatory,
    PropertyFiltersOptional PropertyFiltersOptional
) : IQuery<IPaginatedResult<PropertySummaryFiltered>>;