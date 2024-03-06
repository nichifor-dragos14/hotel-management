using HotelManagement.Core.Rooms;
using HotelManagement.Core.Users;

namespace HotelManagement.Core.Bookings;

public class Booking
{
    private Booking(
        DateTime startOn,
        DateTime endOn,
        DateTime createdOn,
        DateTime updatedOn
    )
    {
        StartOn = startOn;
        EndOn = endOn;
        CreatedOn = createdOn;
        UpdatedOn = updatedOn;
    }

    public Guid Id { get; }

    public DateTime StartOn { get; private set; }

    public DateTime EndOn { get; private set; }

    public DateTime CreatedOn { get; private set; }

    public DateTime UpdatedOn { get; private set; }

    public virtual User User { get; private init; }

    public virtual Room Room { get; private init; }

    public static Booking Create(
        DateTime startOn,
        DateTime endOn,
        User user,
        Room room
    )
    {
        return new Booking(
            startOn,
            endOn,
            DateTime.UtcNow,
            DateTime.UtcNow
        )
        {
            User = user,
            Room = room
        };
    }

    public void Update(
        DateTime startOn,
        DateTime endOn
    )
    {
        StartOn = startOn;
        EndOn = endOn;
        UpdatedOn = DateTime.UtcNow;
    }
}