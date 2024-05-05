using HotelManagement.Core.Properties;
using HotelManagement.Core.Users;

namespace HotelManagement.Core.Discounts;

public class Discount
{
    private Discount(
       DateTime startDate,
       DateTime endDate,
       int discountPercentage,
       DateTime createdOn,
       DateTime updatedOn
    )
    {
        StartDate = startDate;
        EndDate = endDate;
        DiscountPercentage = discountPercentage;
        CreatedOn = createdOn;
        UpdatedOn = updatedOn;
    }

    public Guid Id { get; }

    public DateTime StartDate { get; private set; }

    public DateTime EndDate { get; private set; }

    public int DiscountPercentage { get; private set; }

    public DateTime CreatedOn { get; private set; }

    public DateTime UpdatedOn { get; private set; }

    public virtual User User { get; private init; }

    public virtual Guid UserId { get; private set; }

    public virtual Property Property { get; private set; }

    public virtual Guid PropertyId { get; private set; }

    public static Discount Create(
        DateTime startDate,
        DateTime endDate,
        int discountPercentage,
        User user,
        Property property
    )
    {
        return new Discount(
            startDate,
            endDate,
            discountPercentage,
            DateTime.UtcNow,
            DateTime.UtcNow
        )
        {
            User = user,
            Property = property
        };
    }
}
