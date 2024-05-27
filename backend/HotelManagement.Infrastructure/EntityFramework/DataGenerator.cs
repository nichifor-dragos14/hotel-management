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
    private static readonly List<string> profilePictures = [
        "https://drive.google.com/thumbnail?id=1bl09sEkwExl1W2_IT8mpXGwKz8EpQXHl&sz=w1000",
        "https://drive.google.com/thumbnail?id=1FuXLSany6hY74fYKFvHUrEEj6G1DTd4Y&sz=w1000",
        "https://drive.google.com/thumbnail?id=13RzAfzhGL2uV4Tgx1OXGqQdXLiKeO45X&sz=w1000",
        "https://drive.google.com/thumbnail?id=1iTs4lwP5ds9F49ZmmVVgc5ywYY3MWu-9&sz=w1000",
        "https://drive.google.com/thumbnail?id=1gXbID6a_ZDlmD4jeEI9MCbkEqzGlWWnB&sz=w1000",
        "https://drive.google.com/thumbnail?id=1UjARkIrxDVr3BbCmmcaAHKYYB4NId9om&sz=w1000",
        "https://drive.google.com/thumbnail?id=13jS1gVKZF1a6TQi-az2EIfYPEI-vDV5V&sz=w1000",
        "https://drive.google.com/thumbnail?id=1wKYcwoG96G-8KkJMg1lMSZTuM1YIZV67&sz=w1000",
        "https://drive.google.com/thumbnail?id=1fyk5RZeHwwoWhtzbngPSiSI8r0TcLhOB&sz=w1000",
        "https://drive.google.com/thumbnail?id=1FTYZEz-nMKhf9XkN1DC9nWZP2i2sq_z5&sz=w1000"
    ];

    private static readonly List<string> hotelPictures = [
        "https://drive.google.com/thumbnail?id=10cOCDBmb4jQQ7vhfssLkaktl-O9AJyiR&sz=w1000;https://drive.google.com/thumbnail?id=1H4KreJ7gIBlFV1VHlFncCKMgpREx8Hsl&sz=w1000;https://drive.google.com/thumbnail?id=1Fp4SnvGBIk2Qs1IrZzY2KAwR7UhKAjK7&sz=w1000;https://drive.google.com/thumbnail?id=1ygcmthLq1wv0UEQb2w5lnxrmTr-TlENc&sz=w1000;https://drive.google.com/thumbnail?id=1UQvzS-uV5Vl9w4o8y9teLkUHgUaNefSG&sz=w1000;https://drive.google.com/thumbnail?id=1iYpqeLwnwm1oSCcBcAMBbrmi6smW0b_y&sz=w1000;https://drive.google.com/thumbnail?id=1i5WyaonBWcGcJ2hRJ_7rVR134aFB6lzB&sz=w1000",
        "https://drive.google.com/thumbnail?id=1-iRg5hyhf0kiKQRoY9NChv8Ln75z7Bpc&sz=w1000;https://drive.google.com/thumbnail?id=1pBItI_Arz90LmHs8IzbDwcqe_KeReJwD&sz=w1000;https://drive.google.com/thumbnail?id=15eQ3dGE7Kd4DRTOMSy5USI538ir0OyeY&sz=w1000;https://drive.google.com/thumbnail?id=1XRKYNx5yEqhJdET7Mq5shJFU2OMVT44k&sz=w1000;https://drive.google.com/thumbnail?id=1VwEiev46POMDJtzD5uSKMeFTZgxYa1_m&sz=w1000;https://drive.google.com/thumbnail?id=1CpbOxpvPuuGqGMf0aNqkjqoN4vUC_kkb&sz=w1000",
        "https://drive.google.com/thumbnail?id=1NTBO339baxuDrwyEXDfTXbJSp0brqNjo&sz=w1000;https://drive.google.com/thumbnail?id=1wx7Uzzd4-Hmebx46_pJ5MDXPGIUkJU9e&sz=w1000;https://drive.google.com/thumbnail?id=1pbqHaFvfDxydIeEnNveBeLutzjZXdOqJ&sz=w1000;https://drive.google.com/thumbnail?id=1kHTtOGTRywRhf3RM4hrSJuYXG91-ITTT&sz=w1000",
        "https://drive.google.com/thumbnail?id=1bB1gM500v35NMCCwzkUv1gLDNtaQogUw&sz=w1000;https://drive.google.com/thumbnail?id=1UEoi453YbZk93YZV7iv0n8e1aIdBjFm4&sz=w1000;https://drive.google.com/thumbnail?id=1q_EOWjV2Cb1_oC_laaMy4i7iw_ztlDLD&sz=w1000;https://drive.google.com/thumbnail?id=1lktPkD4-u9ogkgOGZnCraBx_m_xZF5bU&sz=w1000;https://drive.google.com/thumbnail?id=1yNNxPASnJF1Hq-bZ94V0O6CHB8seBjrY&sz=w1000",
        "https://drive.google.com/thumbnail?id=1xta9aj4KEf4TJayovf80y4_cBuXAiXJ1&sz=w1000;https://drive.google.com/thumbnail?id=1OLH65PN4HKi1bdZGLxo7e4AQtONINMse&sz=w1000;https://drive.google.com/thumbnail?id=1r2X5l9cH4ZifneFhTShIxm_Wfyl56WdL&sz=w1000;https://drive.google.com/thumbnail?id=12iZ75XFky63dVwO-Ts6SDG1Rbeh1iy8P&sz=w1000;https://drive.google.com/thumbnail?id=1Scz_dKjJdJSKld3X4l9xO45aHoN_abM1&sz=w1000;https://drive.google.com/thumbnail?id=1ZKcVklltvctOe0liB-4dH-ZYNeyBthCI&sz=w1000;https://drive.google.com/thumbnail?id=1g3rZvZ8NWWnYE55p21zjf4plO4x5d9qG&sz=w1000",
        "https://drive.google.com/thumbnail?id=10Ubwi1ZqTT7N01Z7A5tQofQze9qKpVYP&sz=w1000;https://drive.google.com/thumbnail?id=1DeRqYn2YsSNbeZWsvhSWGyV7-YUKkIl5&sz=w1000;https://drive.google.com/thumbnail?id=1hi9rQ5Uv0dazSoHt_p5ipDc6vJLPW5bJ&sz=w1000;https://drive.google.com/thumbnail?id=1K5HkpG1UrAG9vZu2FMLiiVDJEe5HX1K9&sz=w1000;https://drive.google.com/thumbnail?id=1rdwrrCeLKOL64rtOeNQcUoHMsFDdJ4va&sz=w1000;https://drive.google.com/thumbnail?id=1ZYBepUqRYEOk4ExdTpQOA4XRXtLd14Hy&sz=w1000;https://drive.google.com/thumbnail?id=19oJt8OSuBmJqZ-_0hJ56wFFxNIUISV8f&sz=w1000",
        "https://drive.google.com/thumbnail?id=1BPcTnxsUYR_CgVDR7KmBSYD2yUbD1EKF&sz=w1000;https://drive.google.com/thumbnail?id=1iywPEtwOC-xfEW7LNpXoTza31ZNeZX7z&sz=w1000;https://drive.google.com/thumbnail?id=1JHwUzciEirNQgERRmHY3CaZcMuklAhrZ&sz=w1000",
        "https://drive.google.com/thumbnail?id=1an-ohXnQlvxeYyaEU3N2Ieru5vvfn2Oc&sz=w1000;https://drive.google.com/thumbnail?id=19yjLGNJVUWGaxWMqlVehZ8n19OttgCKJ&sz=w1000",
        "https://drive.google.com/thumbnail?id=1w_W8InjPNYmpzLGJDMr4RyO57uMp8mPe&sz=w1000;https://drive.google.com/thumbnail?id=1zZAb1wKuw7uI30vGFMiwTIDzKt3rpWjL&sz=w1000;https://drive.google.com/thumbnail?id=1wzsisU-wEdu49qphGjRNOPewkdsDR7Rr&sz=w1000;https://drive.google.com/thumbnail?id=1BFIx3ZcHXcz7Ibpkm1FJ64S1e5v4s5N7&sz=w1000;https://drive.google.com/thumbnail?id=14orjy52Lc_5ZyAAir3ixMqGuYh0hqClb&sz=w1000;https://drive.google.com/thumbnail?id=1gBYcrH3LFvrIeepaPteH4wrvaP-nmFFO&sz=w1000",
        "https://drive.google.com/thumbnail?id=1G5AF2DQLpSb-A-wGPWlKALYOsszw16XK&sz=w1000"
    ];

    private static readonly List<string> expectedArrivalOptions = [
        "I don't know",
        "10:00 - 11:00",
        "11:00 - 12:00",
        "12:00 - 13:00",
        "13:00 - 14:00",
        "14:00 - 15:00",
        "15:00 - 16:00",
        "16:00 - 17:00",
        "17:00 - 18:00",
        "18:00 - 19:00",
        "19:00 - 20:00",
        "20:00 - 21:00",
        "21:00 - 22:00",
        "22:00 - 23:00",
        "23:00 - 00:00"
    ];

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
            f.PickRandom(profilePictures),
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
            f.PickRandom(profilePictures),
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
                    f.PickRandom(hotelPictures),
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
                    expectedArrival: f.PickRandom(expectedArrivalOptions),
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
