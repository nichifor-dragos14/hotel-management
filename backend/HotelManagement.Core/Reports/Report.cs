using HotelManagement.Core.Bookings;
using HotelManagement.Core.Properties;
using HotelManagement.Core.Users;

namespace HotelManagement.Core.Reports;

public class Report
{
    internal Report(
        string title,
        string description,
        bool isRead,
        bool isClosed,
        DateTime createdOn,
        DateTime updatedOn
    )
    {
        Title = title;
        Description = description;
        CreatedOn = createdOn;
        UpdatedOn = updatedOn;
        IsRead = isRead;
        IsClosed = isClosed;
    }

    public Guid Id { get; }

    public string Title { get; private set; }

    public string Description { get; private set; }

    public bool IsRead { get; private set; }

    public bool IsClosed { get; private set; }

    public DateTime CreatedOn { get; private set; }

    public DateTime UpdatedOn { get; private set; }

    public virtual Property Property { get; internal init; }

    public virtual User User { get; internal init; }

    public virtual Booking Booking { get; private set; }

    public Guid BookingId { get; set; }

    public static Report Create(
    Property property,
    User user,
    Booking booking,
    string title,
    string description
)
    {
        return new Report(
            title,
            description,
            false,
            false,
            DateTime.UtcNow,
            DateTime.UtcNow
        )
        {
            Property = property,
            User = user,
            Booking = booking
        };
    }

    public void Close()
    {
        IsClosed = true;
    }

    public void Open()
    {
        IsClosed = false;
    }

    public void Read()
    {
        IsRead = true;
    }
}