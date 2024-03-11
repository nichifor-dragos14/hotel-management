using HotelManagement.Core.Bookings;
using HotelManagement.Core.Properties;

namespace HotelManagement.Core.Rooms;

public class Room
{
    internal Room(
        int number,
        RoomType type,
        bool hasPrivateBathroom,
        bool hasTowels,
        bool hasHairdryer,
        bool hasAirConditioning,
        bool hasBalcony,
        bool hasRefrigerator,
        bool hasSeaView,
        DateTime createdOn,
        DateTime updatedOn
    )
    {
        Number = number;
        Type = type;
        HasPrivateBathroom = hasPrivateBathroom;
        HasTowels = hasTowels;
        HasHairdryer = hasHairdryer;
        HasAirConditioning = hasAirConditioning;
        HasBalcony = hasBalcony;
        HasRefrigerator = hasRefrigerator;
        HasSeaView = hasSeaView;
        CreatedOn = createdOn;
        UpdatedOn = updatedOn;
    }

    public Guid Id { get; }

    public int Number { get; private set; }

    public RoomType Type { get; private set; }

    public int Price { get; private set; }

    public bool HasPrivateBathroom { get; private set; }

    public bool HasTowels { get; private set; }

    public bool HasHairdryer { get; private set; }

    public bool HasAirConditioning { get; private set; }

    public bool HasBalcony { get; private set; }

    public bool HasRefrigerator { get; private set; }

    public bool HasSeaView { get; private set; }

    public DateTime CreatedOn { get; private set; }

    public DateTime UpdatedOn { get; private set; }

    public virtual Property Property { get; internal init; }

    public virtual List<Booking> Bookings { get; internal init; }

    public void Update(
        bool hasPrivateBathroom,
        bool hasTowels,
        bool hasHairdryer,
        bool hasAirConditioning,
        bool hasBalcony,
        bool hasRefrigerator
    )
    {
        HasPrivateBathroom = hasPrivateBathroom;
        HasTowels = hasTowels;
        HasHairdryer = hasHairdryer;
        HasAirConditioning = hasAirConditioning;
        HasBalcony = hasBalcony;
        HasRefrigerator = hasRefrigerator;
        UpdatedOn = DateTime.UtcNow;
    }
}