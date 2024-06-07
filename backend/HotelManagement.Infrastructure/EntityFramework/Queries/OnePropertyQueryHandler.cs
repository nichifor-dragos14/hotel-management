using HotelManagement.Core.Abstractions;
using HotelManagement.Core.Properties;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace HotelManagement.Infrastructure.EntityFramework.Queries;

internal class OnePropertyQueryHandler(
    IQueryFacade facade
) : IQueryHandler<OnePropertyQuery, PropertyDetails>
{
    public async Task<PropertyDetails> ExecuteAsync(
        OnePropertyQuery query,
        CancellationToken cancellationToken)
    {
        // Fetch the property and related data in a single query
        var propertyDetails = await facade.Of<Property>()
            .Where(p => p.Id == query.Id)
            .Select(p => new
            {
                Property = p,
                p.Discounts,
                Rooms = p.Rooms.Select(r => new
                {
                    Room = r,
                    r.Bookings
                }).ToList(),
                ReviewCount = p.Reviews.Count(),
                Reviews = p.Reviews
                    .OrderByDescending(r => r.CreatedOn)
                    .Take(4)
                    .Select(r => new
                    {
                        Review = r,
                        r.User
                    }).ToList()
            })
            .FirstOrDefaultAsync(cancellationToken);

        if (propertyDetails == null)
        {
            return null;
        }

        var roomsDetails = propertyDetails.Rooms
            .Where(r =>
                r.Room.Bookings.All(b => (b.StartDate >= query.EndDate) || (b.EndDate <= query.StartDate)) &&
                r.Room.AdultCapacity >= query.NumberOfAdults && r.Room.AdultCapacity + r.Room.ChildrenCapacity >= query.NumberOfAdults + query.NumberOfChildren)
            .OrderBy(r => Math.Abs(r.Room.AdultCapacity + r.Room.ChildrenCapacity - query.NumberOfChildren - query.NumberOfAdults))
            .Take(3)
            .Select(r => new RoomPropertyDetails(
                r.Room.Id,
                r.Room.Number,
                r.Room.Type,
                (query.StartDate != null && query.EndDate != null && r.Room.Price * (query.EndDate - query.StartDate).Days != 0) ? r.Room.Price * (query.EndDate - query.StartDate).Days : r.Room.Price,
                r.Room.AdultCapacity,
                r.Room.ChildrenCapacity,
                r.Room.HasPrivateBathroom,
                r.Room.HasTowels,
                r.Room.HasHairdryer,
                r.Room.HasAirConditioning,
                r.Room.HasBalcony,
                r.Room.HasRefrigerator,
                r.Room.HasSeaView,
                r.Room.CreatedOn,
                r.Room.UpdatedOn
            ))
            .ToList();

        var reviewsDetails = propertyDetails.Reviews
            .Select(r => new ReviewPropertyDetails(
                r.Review.Id,
                r.Review.Title,
                r.Review.Description,
                r.Review.Rating,
                r.Review.CreatedOn,
                r.Review.UpdatedOn,
                r.User == null ? null : new ReviewUserPropertyDetails(
                    r.User.Id,
                    r.User.FirstName,
                    r.User.LastName,
                    r.User.Nationality,
                    r.User.ProfilePicture
                )
            ))
            .ToList();

        var property = propertyDetails.Property;

        var discount = propertyDetails.Discounts
            .Where(d => d.UserId == query.LoggedUserId && DateTime.UtcNow < d.EndDate)
            .Select(d => d.DiscountPercentage)
            .FirstOrDefault();

        return new PropertyDetails(
            property.Id,
            property.Name,
            property.Type,
            property.Description,
            property.Location,
            property.Email,
            property.PhoneNumber,
            property.Rating,
            propertyDetails.Reviews.Any() ? propertyDetails.Reviews.Average(r => r.Review.Rating) : 0,
            property.CreatedOn,
            property.UpdatedOn,
            property.HasFreeWiFi,
            property.HasParking,
            property.HasPool,
            property.HasRestaurant,
            property.HasFitnessCenter,
            property.HasRoomService,
            property.HasPetFriendlyPolicy,
            property.HasBreakfast,
            property.HasKitchen,
            property.HasFreeCancellation,
            property.PrepaymentNeeded,
            propertyDetails.ReviewCount,
            property.PictureUrls.Split(';').ToList(),
            discount,
            roomsDetails,
            reviewsDetails
        );
    }
}
