using HotelManagement.Core.Abstractions;
using HotelManagement.Core.Rooms;
using HotelManagement.Core.Users;

namespace HotelManagement.Core.Bookings;

public record BookingAdminDetails(
    DateTime StartDate,
    DateTime EndDate,
    double TotalPrice,
    string FirstNameOnBooking,
    string LastNameOnBooking,
    string EmailOnBooking,
    string PhoneNumberOnBooking,
    string CountryOnBooking,
    string SpecialMentions,
    string ExpectedArrival,
    int Number,
    RoomType Type,
    int Price,
    int AdultCapacity,
    int ChildrenCapacity,
    string UserProfilePicture,
    string UserFirstName,
    string UserLastName,
    DateTime CreatedOn
);

public record OneBookingAdminQuery(
    Guid? Id
) : IQuery<BookingAdminDetails>;

internal class OneBookingAdminQueryHandler(
    IQueryFacade facade
) : IQueryHandler<OneBookingAdminQuery, BookingAdminDetails>
{
    public async Task<BookingAdminDetails> ExecuteAsync(
        OneBookingAdminQuery query,
        CancellationToken cancellationToken
    )
    {
        var bookingDetails = (from booking in facade.Of<Booking>()
                             where booking.Id == query.Id
                             join room in facade.Of<Room>() on booking.RoomId equals room.Id
                             join user in facade.Of<User>() on booking.UserId equals user.Id
                              select new BookingAdminDetails(
                                 booking.StartDate,
                                 booking.EndDate,
                                 booking.TotalPrice,
                                 booking.FirstNameOnBooking,
                                 booking.LastNameOnBooking,
                                 booking.EmailOnBooking,
                                 booking.PhoneNumberOnBooking,
                                 booking.CountryOnBooking,
                                 booking.SpecialMentions,
                                 booking.ExpectedArrival,
                                 room.Number,
                                 room.Type,
                                 room.Price,
                                 room.AdultCapacity,
                                 room.ChildrenCapacity,
                                 user.ProfilePicture,
                                 user.FirstName,
                                 user.LastName,
                                 booking.CreatedOn
                             )).FirstOrDefault();

        return bookingDetails;
    }
}
