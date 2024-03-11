namespace HotelManagement.Core.Properties.Filters;

public class PropertyFiltersMandatory(string location, DateTime? startDate, DateTime? endDate, int numberOfAdults, int numberOfChildren, int numberOfRooms)
{
    public string Location { get; } = location;

    public DateTime? StartDate { get; } = startDate;

    public DateTime? EndDate { get; } = endDate;

    public int NumberOfAdults { get; } = numberOfAdults;

    public int NumberOfChildren { get; } = numberOfChildren;

    public int NumberOfRooms { get; } = numberOfRooms;
}
