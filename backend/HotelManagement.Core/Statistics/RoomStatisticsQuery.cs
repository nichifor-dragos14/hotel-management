using HotelManagement.Core.Abstractions;

namespace HotelManagement.Core.Statistics;

public record RoomStatistics(
    string PropertyName,
    List<BookingMonthlyStatistics> MonthlyStatistics
);


public record RoomStatisticsQuery(Guid RoomId) : IQuery<RoomStatistics>;
