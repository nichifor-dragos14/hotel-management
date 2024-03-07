using HotelManagement.Core.Properties;

namespace HotelManagement.Core.Reports;

public class Report
{
    internal Report(
        string title,
        string description,
        DateTime createdOn,
        DateTime updatedOn,
        bool isRead
    )
    {
        Title = title;
        Description = description;
        CreatedOn = createdOn;
        UpdatedOn = updatedOn;
        IsRead = isRead;
    }

    public Guid Id { get; }

    public string Title { get; private set; }

    public string Description { get; private set; }

    public bool IsRead { get; private set; }

    public DateTime CreatedOn { get; private set; }

    public DateTime UpdatedOn { get; private set; }

    public virtual Property Property { get; internal init; }
}