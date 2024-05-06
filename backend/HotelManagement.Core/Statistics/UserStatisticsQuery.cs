using HotelManagement.Core.Abstractions;

namespace HotelManagement.Core.Statistics;

public record PropertyReviewStatistics(Guid PropertyId, string PropertyName, string PropertyLocation, double AverageRating);

public record MonthlyBookingStatistics(int Year, int Month, int BookingCount);

public record MonthlyXPStatistics(int Year, int Month, int TotalXP);

public record UserActivityScore(
    Guid UserId, 
    string FirstName, 
    string LastName,
    string PictureUrl,
    int TotalPoints
);

public record UserStatistics(
    Guid UserId,
    List<PropertyReviewStatistics> TopReviewedProperties,
    List<MonthlyBookingStatistics> BookingsByMonth,
    List<MonthlyXPStatistics> XPByMonth
);

public record UserStatisticsQuery(Guid UserId) : IQuery<UserStatistics>;