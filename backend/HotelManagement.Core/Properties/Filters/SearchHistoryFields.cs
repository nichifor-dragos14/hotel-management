namespace HotelManagement.Core.Properties.Filters;

public class SearchHistoryFields(string location, int numberOfAdults, int numberOfChildren, int numberOfRooms)
{
    public string Location { get; } = location;

    public int NumberOfAdults { get; } = numberOfAdults;

    public int NumberOfChildren { get; } = numberOfChildren;

    public int NumberOfRooms { get; } = numberOfRooms;
}
