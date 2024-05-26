using Bogus;
using HotelManagement.Core.Reports;
using HotelManagement.Core.Reviews;
using HotelManagement.Core.Rooms;
using HotelManagement.Core.Users;
using HotelManagement.Core.Properties;
using HotelManagement.Core.Utils;
using HotelManagement.Core.Bookings;

namespace HotelManagement.Infrastructure.EntityFramework;

public static class DataGenerator
{
    private static readonly Random _random = new();

    private static readonly Faker<User> ownerFaker = new Faker<User>()
        .CustomInstantiator(f => User.Create(
            f.Name.FirstName(),
            f.Name.LastName(),
            f.Internet.Email(),
            f.Phone.PhoneNumber(),
            f.Address.Country(),
            f.PickRandom<Gender>(),
            f.Address.FullAddress(),
            f.Date.Past(30, DateTime.UtcNow.AddYears(-18)),
            PasswordUtility.EncryptPassword(f.Internet.Password()),
            "",
            Guid.NewGuid().ToString(),
            Role.Owner
        ));

    private static readonly Faker<User> clientFaker = new Faker<User>()
        .CustomInstantiator(f => User.Create(
            f.Name.FirstName(),
            f.Name.LastName(),
            f.Internet.Email(),
            f.Phone.PhoneNumber(),
            f.Address.Country(),
            f.PickRandom<Gender>(),
            f.Address.FullAddress(),
            f.Date.Past(30, DateTime.UtcNow.AddYears(-18)),
            PasswordUtility.EncryptPassword(f.Internet.Password()),
            "",
            Guid.NewGuid().ToString(),
            Role.Client
        ));

    public static List<User> GeneratePropertyOwners(int numberOfOwners)
    {
        var owners = ownerFaker.Generate(numberOfOwners);

        return owners;
    }

    public static List<User> GenerateClients(int numberOfOwners)
    {
        var owners = clientFaker.Generate(numberOfOwners);

        return owners;
    }

    public static List<Property> GenerateProperties(List<User> owners, int numberOfPropertiesPerUser)
    {
        var properties = new List<Property>();

        foreach (var owner in owners)
        {
            var propertyFaker = new Faker<Property>()
                .CustomInstantiator(f => Property.Create(
                    f.Company.CompanyName(),
                    f.PickRandom<PropertyType>(),
                    f.Lorem.Paragraph(),
                    f.Address.FullAddress(),
                    f.Internet.Email(),
                    f.Phone.PhoneNumber(),
                    f.Random.Int(1, 5),
                    false,
                    f.Random.Bool(),
                    f.Random.Bool(),
                    f.Random.Bool(),
                    f.Random.Bool(),
                    f.Random.Bool(),
                    f.Random.Bool(),
                    f.Random.Bool(),
                    f.Random.Bool(),
                    f.Random.Bool(),
                    f.Random.Bool(),
                    "",
                    owner
                ));

            properties.AddRange(propertyFaker.Generate(numberOfPropertiesPerUser));
        }

        return properties;
    }

    public static List<Room> GenerateRooms(List<Property> properties, int minimumNumberOfRoomsPerProperty, int maximumNumberOfRoomsPerProperty)
    {
        var rooms = new List<Room>();

        foreach (var property in properties)
        {
            var roomFaker = new Faker<Room>()
                .CustomInstantiator(f => Room.Create(
                    f.Random.Int(1, 1000),
                    f.PickRandom<RoomType>(),
                    f.Random.Int(100, 300) * property.Rating,
                    f.Random.Int(1, 4),
                    f.Random.Int(0, 3),
                    f.Random.Bool(),
                    f.Random.Bool(),
                    f.Random.Bool(),
                    f.Random.Bool(),
                    f.Random.Bool(),
                    f.Random.Bool(),
                    f.Random.Bool(),
                    property
                ));

            rooms.AddRange(roomFaker.Generate(_random.Next(minimumNumberOfRoomsPerProperty, maximumNumberOfRoomsPerProperty)));
        }

        return rooms;
    }

    public static List<Booking> GenerateBookings(List<User> users, List<Room> rooms, int minimumBookingsPerRoom, int maximumBookingsPerRoom)
    {
        var bookings = new List<Booking>();

        foreach (var room in rooms) // Generate past bookings
        {
            DateTime endDate = DateTime.UtcNow;
            DateTime startDate = endDate.AddDays(-365);

            var roomBookings = GenerateNonOverlappingBookings(users, room, startDate, endDate, minimumBookingsPerRoom, maximumBookingsPerRoom);
            bookings.AddRange(roomBookings);
        }

        foreach (var room in rooms) // Generate upcoming bookings
        {
            DateTime startDate = DateTime.UtcNow;
            DateTime endDate = startDate.AddDays(365);

            var roomBookings = GenerateNonOverlappingBookings(users, room, startDate, endDate, minimumBookingsPerRoom, maximumBookingsPerRoom);
            bookings.AddRange(roomBookings);
        }

        return bookings;
    }

    private static List<Booking> GenerateNonOverlappingBookings(List<User> users, Room room, DateTime startDate, DateTime endDate, int minimumBookingsPerRoom, int maximumBookingsPerRoom)
    {
        var bookings = new List<Booking>();
        var random = new Random();
        var userFaker = new Faker<User>().CustomInstantiator(f => users[random.Next(users.Count)]);

        var numberOfBookings = random.Next(minimumBookingsPerRoom, maximumBookingsPerRoom);

        for (int i = 0; i < numberOfBookings; i++)
        {
            var bookingStartDate = new Faker().Date.Between(startDate, endDate.AddDays(-1)).ToUniversalTime();
            var bookingEndDate = bookingStartDate.AddDays(new Faker().Random.Int(1, 14)).ToUniversalTime();

            endDate = bookingStartDate;

            var bookingForHimself = random.Next(0, 2) > 0.1;
            var user = userFaker.Generate();

            var booking = new Faker<Booking>()
                .CustomInstantiator(f => Booking.Create(
                    startDate: bookingStartDate,
                    endDate: bookingEndDate,
                    totalPrice: room.Price * (bookingEndDate - bookingStartDate).Days,
                    firstNameOnBooking: bookingForHimself ? user.FirstName : f.Name.FirstName(),
                    lastNameOnBooking: bookingForHimself ? user.LastName : f.Name.LastName(),
                    emailOnBooking: bookingForHimself ? user.Email : f.Internet.Email(),
                    phoneNumberOnBooking: bookingForHimself ? user.PhoneNumber : f.Phone.PhoneNumber(),
                    countryOnBooking: bookingForHimself ? user.Nationality : f.Address.Country(),
                    specialMentions: f.Lorem.Sentence(),
                    expectedArrival: f.Date.Soon(3).ToString("HH:mm"),
                    user: user,
                    room: room
                )).Generate();

            bookings.Add(booking);
        }

        return bookings;
    }

    public static List<Review> GenerateReviews(List<Booking> bookings)
    {
        var random = new Random();
        var reviews = new List<Review>();

        foreach (var booking in bookings)
        {
            var hasReviewed = random.Next(0, 2) > 0.4;

            if (hasReviewed)
            {
                var review = new Faker<Review>()
                    .CustomInstantiator(f => Review.Create(
                        booking: booking,
                        property: booking.Room.Property,
                        user: booking.User,
                        title: f.Lorem.Sentence(),
                        rating: f.Random.Int(1, 10),
                        description: f.Lorem.Paragraph()
                    )).Generate();

            reviews.Add(review);
            }         
        }

        return reviews;
    }

    public static List<Report> GenerateReports(List<Booking> bookings)
    {
        var random = new Random();
        var reports = new List<Report>();

        foreach (var booking in bookings)
        {
            var hasReported = random.Next(0, 2) > 0.95;

            if (hasReported)
            {
                var report = new Faker<Report>()
                    .CustomInstantiator(f => Report.Create(
                        booking: booking,
                        property: booking.Room.Property,
                        user: booking.User,
                        title: f.Lorem.Sentence(),
                        description: f.Lorem.Paragraph()
                    )).Generate();

                reports.Add(report);
            }
        }

        return reports;
    }
}
