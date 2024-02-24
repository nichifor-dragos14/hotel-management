using HotelManagement.Core.Abstractions;

namespace HotelManagement.Core.Properties;

public record PropertySummary(
    Guid Id,
    string Name,
    string Location
);

public record AllPropertiesQuery : IQuery<IEnumerable<PropertySummary>>;

internal class AllHotelsQueryHandler(
    IQueryFacade facade
) : IQueryHandler<AllPropertiesQuery, IEnumerable<PropertySummary>>
{
    public async Task<IEnumerable<PropertySummary>> ExecuteAsync(
        AllPropertiesQuery query,
        CancellationToken cancellationToken)
    {
        return
            from property in facade.Of<Property>()
            select new PropertySummary(
                property.Id,
                property.Name,
                property.Location
            );
    }
}