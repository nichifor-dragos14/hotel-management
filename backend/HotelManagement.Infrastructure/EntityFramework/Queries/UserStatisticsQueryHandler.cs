using HotelManagement.Core.Abstractions;
using HotelManagement.Core.Bookings;
using HotelManagement.Core.Reviews;
using HotelManagement.Core.Statistics;
using HotelManagement.Core.Users;
using Microsoft.EntityFrameworkCore;

namespace HotelManagement.Infrastructure.EntityFramework.Queries;

internal class UserStatisticsQueryHandler(
    ApplicationDbContext dbContext
) : IQueryHandler<UserStatisticsQuery, UserStatistics>
{
    public async Task<UserStatistics> ExecuteAsync(
        UserStatisticsQuery query,
        CancellationToken cancellationToken
    )
    {
        var userId = query.UserId;
        var oneYearAgo = DateTime.UtcNow.AddYears(-1);

        var user = await dbContext.Set<User>()
            .Include(u => u.Reviews)
                .ThenInclude(r => r.Property)
            .Include(u => u.Bookings)
            .FirstOrDefaultAsync(u => u.Id == userId, cancellationToken);

        if (user == null)
        {
            return null;
        }

        var topReviewedProperties = await dbContext.Set<Review>()
            .Where(r => r.UserId == userId)
            .GroupBy(r => new { r.PropertyId, r.Property.Name, r.Property.Location })
            .Select(g => new
            {
                PropertyId = g.Key.PropertyId,
                PropertyName = g.Key.Name,
                PropertyLocation = g.Key.Location,
                AverageRating = g.Average(r => r.Rating)
            })
            .OrderByDescending(prs => prs.AverageRating)
            .Take(10)
            .ToListAsync(cancellationToken);

        var topReviewedPropertyStats = topReviewedProperties.Select(g => new PropertyReviewStatistics(
            g.PropertyId,
            g.PropertyName,
            g.PropertyLocation,
            g.AverageRating
        )).ToList();

        var bookingsByMonth = await dbContext.Set<Booking>()
            .Where(b => b.UserId == userId && b.StartDate >= oneYearAgo)
            .GroupBy(b => new { b.StartDate.Year, b.StartDate.Month })
            .Select(g => new
            {
                Year = g.Key.Year,
                Month = g.Key.Month,
                BookingCount = g.Count()
            })
            .ToListAsync(cancellationToken);

        var monthlyBookingStats = bookingsByMonth.Select(g => new MonthlyBookingStatistics(
            g.Year,
            g.Month,
            g.BookingCount
        )).ToList();

        var xpByMonth = await dbContext.Set<Booking>()
            .Where(b => b.UserId == userId && b.StartDate >= oneYearAgo)
            .GroupBy(b => new { b.StartDate.Year, b.StartDate.Month })
            .Select(g => new
            {
                Year = g.Key.Year,
                Month = g.Key.Month,
                TotalXP = g.Sum(b => (int)(b.TotalPrice / 100))
            })
            .ToListAsync(cancellationToken);

        var monthlyXPStats = xpByMonth.Select(g => new MonthlyXPStatistics(
            g.Year,
            g.Month,
            g.TotalXP
        )).ToList();

        var topUsers = await dbContext.Set<User>()
            .Where(u => u.Role == Role.Client)
            .Select(u => new
            {
                u.Id,
                u.FirstName,
                u.LastName,
                u.ProfilePicture,
                TotalPoints = (u.Bookings.Sum(b => (int)b.TotalPrice) / 100) + (u.Reviews.Count * 2)
            })
            .OrderByDescending(u => u.TotalPoints)
            .Take(10)
            .ToListAsync(cancellationToken);

        var userScores = topUsers.Select(u => new UserActivityScore(
            u.Id,
            u.FirstName,
            u.LastName,
            u.ProfilePicture,
            u.TotalPoints
        )).ToList();

        return new UserStatistics(
            UserId: user.Id,
            TopReviewedProperties: topReviewedPropertyStats,
            BookingsByMonth: monthlyBookingStats,
            XPByMonth: monthlyXPStats,
            topUsers: userScores
        );
    }
}
