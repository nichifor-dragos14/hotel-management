using HotelManagement.Core.Properties;
using HotelManagement.Core.Users;

namespace HotelManagement.Core.Reviews;

public class Review
{
    internal Review(
        string title,
        string description,
        double rating,
        DateTime createdOn,
        DateTime updatedOn
    )
    {
        Title = title;
        Description = description;
        Rating = rating;
        CreatedOn = createdOn;
        UpdatedOn = updatedOn;
    }

    public Guid Id { get; }

    public string Title { get; private set; }

    public string Description { get; private set; }

    public double Rating {  get; private set; }

    public DateTime CreatedOn { get; private set; }

    public DateTime UpdatedOn { get; private set; }

    public virtual Property Property { get; internal init; }

    public virtual User User { get; private set; }

    public void Update(
        string title,
        string description,
        double rating
    )
    {
        Title = title;
        Description = description;
        Rating= rating;
        UpdatedOn = DateTime.UtcNow;
    }
}