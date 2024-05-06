using HotelManagement.Core.Abstractions;

namespace HotelManagement.Core.Statistics;

public record BookingMonthlyStatistics(
    int Month,
    int Year,
    int NumberOfBookings,
    double TotalRevenue,
    double OccupancyRate
);

public record ReviewStatistics(
    Guid ReviewId,
    int Rating
);

public record PropertyStatistics(
    string PropertyName,
    List<BookingMonthlyStatistics> MonthlyStatistics,
    List<ReviewStatistics> ReviewStatistics
);


public record PropertyStatisticsQuery(Guid PropertyId) : IQuery<PropertyStatistics>;
