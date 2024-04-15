using HotelManagement.Core.Abstractions;

namespace HotelManagement.Core.Properties;

public record PropertyTypeSummary(
    string Type,
    PropertyType Value
);

public record AllPropertyTypesQuery : IQuery<IEnumerable<PropertyTypeSummary>>;

internal class AllPropertyTypesQueryHandler(
    IQueryFacade facade
) : IQueryHandler<AllPropertyTypesQuery, IEnumerable<PropertyTypeSummary>>
{
    public async Task<IEnumerable<PropertyTypeSummary>> ExecuteAsync(
        AllPropertyTypesQuery query,
        CancellationToken cancellationToken)
    {
        List<PropertyTypeSummary> summaries = [];

        foreach (PropertyType type in Enum.GetValues(typeof(PropertyType)))
        {
            summaries.Add(new PropertyTypeSummary(type.ToString(), type));
        }

        return summaries;
    }
}