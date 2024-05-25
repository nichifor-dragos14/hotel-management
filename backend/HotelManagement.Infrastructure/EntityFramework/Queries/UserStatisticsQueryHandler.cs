using HotelManagement.Core.Abstractions;
using HotelManagement.Core.Bookings;
using HotelManagement.Core.Reviews;
using HotelManagement.Core.Statistics;
using HotelManagement.Core.Users;
using Microsoft.EntityFrameworkCore;

namespace HotelManagement.Infrastructure.EntityFramework.Queries;

internal class UserStatisticsQueryHandler(
    IQueryFacade facade
) : IQueryHandler<UserStatisticsQuery, UserStatistics>
{
    public async Task<UserStatistics> ExecuteAsync(
        UserStatisticsQuery query,
        CancellationToken cancellationToken
        )
    {
        var user = await facade.Of<User>()
               .Include(u => u.Reviews)
               .ThenInclude(r => r.Property)
               .Include(u => u.Bookings)
               .ThenInclude(b => b.Review)
               .FirstOrDefaultAsync(u => u.Id == query.UserId, cancellationToken);

        if (user == null)
        {
            return null;
        }
      
        var topReviewedProperties = user.Reviews
            .GroupBy(r => r.PropertyId)
            .Select(g => new PropertyReviewStatistics(
                PropertyId: g.Key,
                PropertyName: g.First().Property.Name,
                PropertyLocation: g.First().Property.Location,
                AverageRating: g.Average(r => r.Rating)
            ))
            .OrderByDescending(prs => prs.AverageRating)
            .Take(10)
            .ToList();

        var oneYearAgo = DateTime.Today.AddYears(-1);

        var bookingsByMonth = user.Bookings
            .Where(b => b.StartDate >= oneYearAgo)
            .GroupBy(b => new { b.StartDate.Year, b.StartDate.Month })
            .Select(g => new MonthlyBookingStatistics(
                Year: g.Key.Year,
                Month: g.Key.Month,
                BookingCount: g.Count()
            ))
            .ToList();

        var xpByMonth = user.Bookings
            .Where(b => b.StartDate >= oneYearAgo)
            .GroupBy(b => new { b.StartDate.Year, b.StartDate.Month })
            .Select(g => new MonthlyXPStatistics(
                Year: g.Key.Year,
                Month: g.Key.Month,
                TotalXP: g.Sum(b => (int)(b.TotalPrice / 100))
            ))
            .ToList();

        var userData = await facade.Of<User>()
        .Where(u => u.Role == Role.Client)
        .Select(u => new
        {
            u.Id,
            u.FirstName,
            u.LastName,
            u.ProfilePicture,
            BookingIds = u.Bookings.Select(b => b.Id),
            ReviewIds = u.Reviews.Select(r => r.Id)
        })
        .ToListAsync(cancellationToken);

        var bookingSums = await facade.Of<Booking>()
            .Where(b => userData.Select(u => u.Id).Contains(b.UserId))
            .GroupBy(b => b.UserId)
            .Select(g => new { UserId = g.Key, TotalPrice = g.Sum(b =>(int) b.TotalPrice) })
            .ToListAsync(cancellationToken);

        var reviewCounts = await facade.Of<Review>()
            .Where(r => userData.Select(u => u.Id).Contains(r.UserId))
            .GroupBy(r => r.UserId)
            .Select(g => new { UserId = g.Key, Count = g.Count() })
            .ToListAsync(cancellationToken);

        var userScores = userData.Select(u => new UserActivityScore(
             u.Id,
             u.FirstName,
             u.LastName,
             u.ProfilePicture,
             (bookingSums.FirstOrDefault(b => b.UserId == u.Id)?.TotalPrice ?? 0) / 100
                + reviewCounts.FirstOrDefault(r => r.UserId == u.Id)?.Count * 2 ?? 0
            )
        )
        .OrderByDescending(us => us.TotalPoints)
        .Take(10)
        .ToList();

        return new UserStatistics(
            UserId: user.Id,
            TopReviewedProperties: topReviewedProperties,
            BookingsByMonth: bookingsByMonth,
            XPByMonth: xpByMonth,
            topUsers: userScores
        );
    }
}
