using HotelManagement.Core.Abstractions;
using HotelManagement.Core.Bookings;
using HotelManagement.Core.Properties;
using HotelManagement.Core.Reports;
using HotelManagement.Core.Reviews;
using HotelManagement.Core.Rooms;
using Microsoft.EntityFrameworkCore;

namespace HotelManagement.Infrastructure.EntityFramework.Queries;

internal class OneBookingQueryHandler(
IQueryFacade facade
) : IQueryHandler<OneBookingQuery, BookingDetails>
{
public async Task<BookingDetails> ExecuteAsync(
    OneBookingQuery query,
    CancellationToken cancellationToken)
{
    var bookingDetails = (from b in facade.Of<Booking>().Include(b => b.Room)
                          join r in facade.Of<Room>() on b.Room.Id equals r.Id
                          where b.Id == query.Id
                          select new
                          {
                              Booking = b
                          })
                           .FirstOrDefault();

    if (bookingDetails == null)
    {
        return null;
    }

    var reviewId = (from r in facade.Of<Review>().Include(b => b.Booking)
                    where r.BookingId == query.Id
                    select r.Id)
                        .FirstOrDefault();

    var reportId = (from r in facade.Of<Report>().Include(b => b.Booking)
                    where r.BookingId == query.Id
                    select r.Id)
                    .FirstOrDefault();

    var roomDetails = (from r in facade.Of<Room>().Include(r => r.Property)
                join p in facade.Of<Property>() on r.Property.Id equals p.Id
                where r.Id == bookingDetails.Booking.Room.Id
                select new BookingRoomDetails
                (
                    r.Id,
                    r.Number,
                    r.Type,
                    r.Price,
                    r.AdultCapacity,
                    r.ChildrenCapacity,
                    r.HasPrivateBathroom,
                    r.HasTowels,
                    r.HasHairdryer,
                    r.HasAirConditioning,
                    r.HasBalcony,
                    r.HasRefrigerator,
                    r.HasSeaView,
                    r.Property.Id,
                    r.CreatedOn,
                    r.UpdatedOn
                ))
                    .FirstOrDefault();

    var propertyDetails = (from p in facade.Of<Property>()
                           where p.Id == roomDetails.PropertyId
                           select new BookingPropertyDetails
                           (
                              p.Id,
                              p.Name,
                              p.Type,
                              p.Location,
                              p.Email,
                              p.PhoneNumber,
                              p.Rating,
                              p.CreatedOn,
                              p.UpdatedOn,
                              p.HasFreeWiFi,
                              p.HasParking,
                              p.HasPool,
                              p.HasRestaurant,
                              p.HasFitnessCenter,
                              p.HasRoomService,
                              p.HasPetFriendlyPolicy,
                              p.HasBreakfast,
                              p.HasFreeCancellation,
                              p.PrepaymentNeeded
                           ))
                           .FirstOrDefault();

    return new BookingDetails(
          bookingDetails.Booking.Id,
          bookingDetails.Booking.StartDate,
          bookingDetails.Booking.EndDate,
          bookingDetails.Booking.TotalPrice,
          bookingDetails.Booking.FirstNameOnBooking,
          bookingDetails.Booking.LastNameOnBooking,
          bookingDetails.Booking.EmailOnBooking,
          bookingDetails.Booking.PhoneNumberOnBooking,
          bookingDetails.Booking.CountryOnBooking,
          bookingDetails.Booking.SpecialMentions,
          bookingDetails.Booking.ExpectedArrival,
          bookingDetails.Booking.CreatedOn,
          bookingDetails.Booking.UpdatedOn,
          reviewId,
          reportId,
          propertyDetails,
          roomDetails
    );
}
}