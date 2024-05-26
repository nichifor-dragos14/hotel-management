using HotelManagement.Core.Bookings;
using HotelManagement.Core.Properties;
using HotelManagement.Core.Reports;
using HotelManagement.Core.Reviews;
using HotelManagement.Core.Rooms;
using HotelManagement.Core.Users;
using Microsoft.EntityFrameworkCore;

namespace HotelManagement.Infrastructure.EntityFramework;

public class DatabaseSeeder(DbContext context)
{
    private readonly DbContext _context = context;

    public void Seed(
        int numberOfOwners,
        int numberOfClients,
        int propertiesPerUser,
        int minimumNumberOfRoomsPerProperty,
        int maximumNumberOfRoomsPerProperty,
        int minimumBookingsPerRoom,
        int maximumBookingsPerRoom)
    {
        // Generate property owners
        var owners = DataGenerator.GeneratePropertyOwners(numberOfOwners);

        _context.Set<User>().AddRange(owners);
        _context.SaveChanges();

        // Generate clients
        var clients = DataGenerator.GenerateClients(numberOfClients);

        _context.Set<User>().AddRange(clients);
        _context.SaveChanges();

        // Generate properties
        var ownersForProperties = _context.Set<User>().Where(u => u.Role == Role.Owner).ToList();

        var properties = DataGenerator.GenerateProperties(ownersForProperties, propertiesPerUser);

        _context.Set<Property>().AddRange(properties);
        _context.SaveChanges();

        // Generate rooms
        var propertiesForRooms = _context.Set<Property>().ToList();

        var rooms = DataGenerator.GenerateRooms(propertiesForRooms, minimumNumberOfRoomsPerProperty, maximumNumberOfRoomsPerProperty);

        _context.Set<Room>().AddRange(rooms);
        _context.SaveChanges();

        // Generate past and upcoming bookings
        var clientsForBookings = _context.Set<User>().Where(u => u.Role == Role.Client).ToList();
        var roomsForBookings = _context.Set<Room>().ToList();

        var bookings = DataGenerator.GenerateBookings(clientsForBookings, roomsForBookings, minimumBookingsPerRoom, maximumBookingsPerRoom);

        _context.Set<Booking>().AddRange(bookings);
        _context.SaveChanges();

        // Generate reviews
        var bookingsForReviews = _context.Set<Booking>().Where(b => b.EndDate < DateTime.UtcNow).Include(b => b.User).Include(b => b.Room).ThenInclude(r => r.Property).ToList();

        var reviews = DataGenerator.GenerateReviews(bookingsForReviews);

        _context.Set<Review>().AddRange(reviews);
        _context.SaveChanges();

        // Generate reports
        var bookingsForReports = _context.Set<Booking>().Include(b => b.User).Include(b => b.Room).ThenInclude(r => r.Property).ToList();

        var reports = DataGenerator.GenerateReports(bookingsForReports);

        _context.Set<Report>().AddRange(reports);
        _context.SaveChanges();
    }
}