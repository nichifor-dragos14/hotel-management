﻿using HotelManagement.Core.Abstractions;
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

        var propertyDetails = (from p in facade.Of<Property>().Include(p => p.Rooms).ThenInclude(r => r.Bookings)
                               where p.Id == query.Id
                               select new
                               {
                                   Property = p,
                                   Rooms = p.Rooms.OrderBy(r => r.CreatedOn).Take(3),
                                   ReviewCount = p.Reviews.Count(),
                                   Reviews = p.Reviews.OrderBy(r => r.CreatedOn).Take(5).Select(r => new
                                   {
                                       Review = r,
                                       r.User
                                   })
                               })
                               .FirstOrDefault();

        if (propertyDetails == null)
        {
            return null;
        }

        var roomsDetails = propertyDetails.Rooms
            .Where(r => r.Bookings.Any(b => (query.EndDate <= b.StartDate) || (query.StartDate >= b.EndDate)) || !r.Bookings.Any())
            .Select(r => new RoomPropertyDetails(
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
            r.CreatedOn,
            r.UpdatedOn
        )).ToList();

        var reviewsDetails = propertyDetails.Reviews.Select(r => new ReviewPropertyDetails(
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
                r.User.Nationality
            )
        )).ToList();

        var property = propertyDetails.Property;

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
            property.HasFreeCancellation,
            property.PrepaymentNeeded,
            propertyDetails.ReviewCount,
            roomsDetails,
            reviewsDetails
        );
    }
}
