using HotelManagement.Core.Abstractions;
using HotelManagement.Core.Statistics;
using Microsoft.EntityFrameworkCore;
using HotelManagement.Core.Bookings;
using HotelManagement.Core.Rooms;

namespace HotelManagement.Infrastructure.EntityFramework.Queries;

internal class RoomStatisticsQueryHandler(
    IQueryFacade facade
) : IQueryHandler<RoomStatisticsQuery, RoomStatistics>
{
    public async Task<RoomStatistics> ExecuteAsync(
        RoomStatisticsQuery query,
        CancellationToken cancellationToken
        )
    {
        var room = await facade.Of<Room>()
            .Include(r => r.Bookings)
            .Include(r => r.Property)
            .FirstOrDefaultAsync(r => r.Id == query.RoomId, cancellationToken);

        if (room == null)
        {
            return null;
        }

        var startDate = DateTime.UtcNow.AddYears(-1);
        var endDate = DateTime.UtcNow.AddYears(1);

        var monthlyStatistics = GenerateEmptyMonthlyStatistics(startDate, endDate);

        var actualMonthlyStatistics = room.Bookings
            .GroupBy(b => new { Year = b.StartDate.Year, Month = b.StartDate.Month })
            .Select(g => new BookingMonthlyStatistics(
                Month: g.Key.Month,
                Year: g.Key.Year,
                NumberOfBookings: g.Count(),
                TotalRevenue: g.Sum(b => b.TotalPrice),
                OccupancyRate: CalculateOccupancyRate(g, g.Key.Year, g.Key.Month)
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

        return new RoomStatistics(
            PropertyName: room.Property.Name,
            MonthlyStatistics: monthlyStatistics
        );
    }

    private double CalculateOccupancyRate(IGrouping<object, Booking> bookingGroup, int year, int month)
    {
        int daysInMonth = DateTime.DaysInMonth(year, month);
        double totalBookedRoomDays = bookingGroup.Sum(b => (b.EndDate - b.StartDate).Days);
        return (totalBookedRoomDays / daysInMonth) * 100;
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
