using HotelManagement.Core.Abstractions;
using HotelManagement.Core.Discounts;

namespace HotelManagement.Core.Properties;

public record OnePropertyDiscountQuery
    (Guid PropertyId,
    Guid UserId
) : IQuery<int>;

internal class OnePropertyDiscountQueryHandler(
    IQueryFacade facade
) : IQueryHandler<OnePropertyDiscountQuery, int>
{
    public async Task<int> ExecuteAsync(
        OnePropertyDiscountQuery query,
        CancellationToken cancellationToken)
    {
        return
            (from discount in facade.Of<Discount>()
             where discount.PropertyId == query.PropertyId && discount.UserId == query.UserId && DateTime.UtcNow < discount.EndDate
             select discount.DiscountPercentage)
            .FirstOrDefault();
    }
}
