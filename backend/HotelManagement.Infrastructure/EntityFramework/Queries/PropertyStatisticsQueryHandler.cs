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

        var property = await properties.FirstOrDefaultAsync(p => p.Id == query.PropertyId);

        if (property == null)
        {
            return null;
        }

        var reviewsStatistics = property.Reviews.Select(r => new ReviewStatistics(r.Id, (int) r.Rating)).ToList();

        var monthlyStatistics = property.Rooms
                .SelectMany(room => room.Bookings)
                .GroupBy(b => new { Year = b.StartDate.Year, Month = b.StartDate.Month })
                .Select(g => new BookingMonthlyStatistics(
                    Month: g.Key.Month,
                    Year: g.Key.Year,
                    NumberOfBookings: g.Count(),
                    TotalRevenue: g.Sum(b => b.TotalPrice),
                    OccupancyRate: CalculateOccupancyRate(g, property.Rooms.Count, g.Key.Year, g.Key.Month)
                ))
                .ToList();

        return new PropertyStatistics(
            PropertyName: property.Name,
            MonthlyStatistics: monthlyStatistics,
            ReviewStatistics: reviewsStatistics
        );
    }

    private double CalculateOccupancyRate(IGrouping<object, Booking> bookingGroup, int totalRooms, int year, int month)
    {
        int daysInMonth = DateTime.DaysInMonth(year, month);
        double totalBookedRoomDays = bookingGroup.Sum(b => (b.EndDate - b.StartDate).Days);

        return (totalBookedRoomDays / (totalRooms * daysInMonth)) * 100; 
    }
}
