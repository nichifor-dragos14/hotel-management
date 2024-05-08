using HotelManagement.Core.Abstractions;
using HotelManagement.Core.Properties.Filters;
using HotelManagement.Core.Rooms;

namespace HotelManagement.Core.Properties;

public record PropertySummaryRecommendation(
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
    string ImageUrl,
    int DiscountPercentage,
    DateTime CreatedOn,
    int RowNumber
);

public record AllPropertyRecommendationSummariesQuery(
    Guid? LoggedUserId, 
    int From,
    int To,
    List<SearchHistoryFields> SearchHistory
) : IQuery<IPaginatedResult<PropertySummaryRecommendation>>;