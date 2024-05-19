using HotelManagement.Core.Abstractions;
using HotelManagement.Core.Properties;
using Microsoft.EntityFrameworkCore;

namespace HotelManagement.Infrastructure.EntityFramework.Queries;

internal class OnePropertyQueryHandler(
IQueryFacade facade
) : IQueryHandler<OnePropertyQuery, PropertyDetails>
{
    public async Task<PropertyDetails> ExecuteAsync(
        OnePropertyQuery query,
        CancellationToken cancellationToken)
    {

        var propertyDetails = (from p in facade.Of<Property>().Include(p=>p.Discounts).Include(p => p.Rooms).ThenInclude(r => r.Bookings)
                               where p.Id == query.Id
                               select new
                               {
                                   Property = p,
                                   Rooms = p.Rooms.ToList(),
                                   ReviewCount = p.Reviews.Count(),
                                   Reviews = p.Reviews.Select(r => new
                                   {
                                       Review = r,
                                       r.User
                                   }).ToList()
                               })
                               .FirstOrDefault();

        if (propertyDetails == null)
        {
            return null;
        }

        var roomsDetails = propertyDetails.Rooms
            .Where(r => 
                    r.Bookings.All(b => (b.StartDate >= query.EndDate ) || (b.EndDate <= query.StartDate)) &&
                    r.AdultCapacity >= query.NumberOfAdults && r.AdultCapacity + r.ChildrenCapacity >= query.NumberOfAdults + query.NumberOfChildren)
            .OrderBy(r => Math.Abs(r.AdultCapacity + r.ChildrenCapacity - query.NumberOfChildren - query.NumberOfAdults))
            .Take(3)
            .Select(r => new RoomPropertyDetails(
            r.Id,
            r.Number,
            r.Type,
            (query.StartDate != null && query.EndDate != null) ? r.Price * (query.EndDate - query.StartDate).Days : r.Price,
            r.AdultCapacity,
            r.ChildrenCapacity,
            r.HasPrivateBathroom,
            r.HasTowels,
            r.HasHairdryer,
            r.HasAirConditioning,
            r.HasBalcony,
            r.HasRefrigerator,
            r.HasSeaView,
            r.CreatedOn,
            r.UpdatedOn
        )).ToList();

        var reviewsDetails = propertyDetails.Reviews
            .OrderBy(r => r.Review.CreatedOn)
            .Take(4)
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
        )).ToList();

        var property = propertyDetails.Property;

        var discount = property.Discounts.Where(d => d.UserId == query.LoggedUserId && DateTime.UtcNow < d.EndDate).FirstOrDefault();

        return new PropertyDetails(
            property.Id,
            property.Name,
            property.Type,
            property.Description,
            property.Location,
            property.Email,
            property.PhoneNumber,
            property.Rating,
            property.Reviews?.Any() == true ? property.Reviews.Average(r => r.Rating) : 0,
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
            [.. property.PictureUrls.Split(';')],
            discount != null ? discount.DiscountPercentage : 0,
            roomsDetails,
            reviewsDetails
        );
    }
}
