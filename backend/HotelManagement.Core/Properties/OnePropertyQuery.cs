using HotelManagement.Core.Abstractions;

namespace HotelManagement.Core.Properties;

public record PropertyDetails(
    Guid Id,
    string Name,
    PropertyType Type,
    string Description,
    string Location,
    string Email,
    string PhoneNumber,
    DateTime CreatedOn,
    DateTime UpdatedOn,
    bool HasFreeWiFi,
    bool HasParking,
    bool HasPool,
    bool HasRestaurant,
    bool HasFitnessCentre,
    bool HasRoomService,
    bool HasPetFriendlyPolicy,
    bool HasBreakfast,
    bool HasFreeCancellation
);

public record OnePropertyQuery(Guid? Id) : IQuery<PropertyDetails>;

internal class OneHotelQueryHandler(
    IQueryFacade facade
) : IQueryHandler<OnePropertyQuery, PropertyDetails>
{
    public async Task<PropertyDetails> ExecuteAsync(
        OnePropertyQuery query,
        CancellationToken cancellationToken
    )
    {
        return
            (from property in facade.Of<Property>()
             where property.Id == query.Id
             select new PropertyDetails(
                 property.Id,
                 property.Name,
                 property.Type,
                 property.Description,
                 property.Location,
                 property.Email,
                 property.PhoneNumber,
                 property.CreatedOn,
                 property.UpdatedOn,
                 property.HasFreeWiFi,
                 property.HasParking,
                 property.HasPool,
                 property.HasRestaurant,
                 property.HasFitnessCentre,
                 property.HasRoomService,
                 property.HasPetFriendlyPolicy,
                 property.HasBreakfast,
                 property.HasFreeCancellation
             )
            ).FirstOrDefault();
    }
}