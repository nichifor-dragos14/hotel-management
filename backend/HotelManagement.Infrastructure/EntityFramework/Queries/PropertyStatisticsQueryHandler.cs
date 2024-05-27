using HotelManagement.Core.Abstractions;
using HotelManagement.Core.Bookings;
using HotelManagement.Core.Properties;
using HotelManagement.Core.Statistics;
using Microsoft.EntityFrameworkCore;

namespace HotelManagement.Infrastructure.EntityFramework.Queries;

internal class PropertyStatisticsQueryHandler(
    IQueryFacade facade
) : IQueryHandler<PropertyStatisticsQuery, PropertyStatistics>
{
    public async Task<PropertyStatistics> ExecuteAsync(
        PropertyStatisticsQuery query,
        CancellationToken cancellationToken
        )
    {
        var properties = facade.Of<Property>()
            .Include(p => p.Reviews)
            .Include(p => p.Rooms)
                .ThenInclude(r => r.Bookings);

        var property = await properties.FirstOrDefaultAsync(p => p.Id == query.PropertyId, cancellationToken);

        if (property == null)
        {
            return null;
        }

        var reviewsStatistics = property.Reviews
            .Select(r => new ReviewStatistics(r.Id, (int)r.Rating))
            .ToList();

        var bookingGroups = property.Rooms
            .SelectMany(room => room.Bookings)
            .GroupBy(b => (b.StartDate.Year, b.StartDate.Month))
            .ToDictionary(g => g.Key, g => g);

        var startDate = DateTime.UtcNow.AddYears(-1);
        var endDate = DateTime.UtcNow.AddYears(1);

        var monthlyStatistics = GenerateEmptyMonthlyStatistics(startDate, endDate);

        var actualMonthlyStatistics = property.Rooms
            .SelectMany(room => room.Bookings)
            .GroupBy(b => (b.StartDate.Year, b.StartDate.Month))
            .Select(g => new BookingMonthlyStatistics(
                Month: g.Key.Month,
                Year: g.Key.Year,
                NumberOfBookings: g.Count(),
                TotalRevenue: g.Sum(b => b.TotalPrice),
                OccupancyRate: CalculateOccupancyRate(g, property.Rooms.Count, g.Key.Year, g.Key.Month)
            ))
            .ToList();

        foreach (var stats in actualMonthlyStatistics)
        {
            var index = monthlyStatistics.FindIndex(m => m.Year == stats.Year && m.Month == stats.Month);
            if (index >= 0)
            {
                monthlyStatistics[index] = stats;
            }
        }

        return new PropertyStatistics(
            PropertyName: property.Name,
            MonthlyStatistics: monthlyStatistics,
            ReviewStatistics: reviewsStatistics
        );
    }

    private double CalculateOccupancyRate(
        IGrouping<(int Year, int Month), Booking> bookingGroup,
        int totalRooms,
        int year,
        int month)
    {
        int daysInMonth = DateTime.DaysInMonth(year, month);
        double totalBookedRoomDays = bookingGroup.Sum(b => (b.EndDate - b.StartDate).Days);

        return (totalBookedRoomDays / (totalRooms * daysInMonth)) * 100;
    }

    private List<BookingMonthlyStatistics> GenerateEmptyMonthlyStatistics(DateTime startDate, DateTime endDate)
    {
        var statistics = new List<BookingMonthlyStatistics>();
        var currentDate = new DateTime(startDate.Year, startDate.Month, 1);

        while (currentDate <= endDate)
        {
            statistics.Add(new BookingMonthlyStatistics(
                Month: currentDate.Month,
                Year: currentDate.Year,
                NumberOfBookings: 0,
                TotalRevenue: 0,
                OccupancyRate: 0
            ));
            currentDate = currentDate.AddMonths(1);
        }

        return statistics;
    }
}
