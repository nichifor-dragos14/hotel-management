using HotelManagement.Core.Bookings;
using HotelManagement.Core.Properties;

namespace HotelManagement.Core.Rooms;

public class Room
{
    internal Room(
        int number,
        RoomType type,
        int price,
        int adultCapacity,
        int childrenCapacity,
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
        Price = price;
        AdultCapacity = adultCapacity;
        ChildrenCapacity = childrenCapacity;
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

    public int AdultCapacity { get; private set; }

    public int ChildrenCapacity { get; private set; }

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

    public static Room Create(
        int number,
        RoomType type,
        int price,
        int adultCapacity,
        int childrenCapacity,
        bool hasPrivateBathroom,
        bool hasTowels,
        bool hasHairdryer,
        bool hasAirConditioning,
        bool hasBalcony,
        bool hasRefrigerator,
        bool hasSeaView,
        Property property
    )
    {
        return new Room(
            number,
            type,
            price,
            adultCapacity,
            childrenCapacity,
            hasPrivateBathroom,
            hasTowels,
            hasHairdryer,
            hasAirConditioning,
            hasBalcony,
            hasRefrigerator,
            hasSeaView,
            DateTime.UtcNow,
            DateTime.UtcNow
        )
        {
            Property = property,
            Bookings = []
        };
    }

    public void Update(
        int price,
        bool hasPrivateBathroom,
        bool hasTowels,
        bool hasHairdryer,
        bool hasAirConditioning,
        bool hasBalcony,
        bool hasRefrigerator,
        bool hasSeaView
    )
    {
        Price = price;
        HasPrivateBathroom = hasPrivateBathroom;
        HasTowels = hasTowels;
        HasHairdryer = hasHairdryer;
        HasAirConditioning = hasAirConditioning;
        HasBalcony = hasBalcony;
        HasRefrigerator = hasRefrigerator;
        HasSeaView = hasSeaView;
        UpdatedOn = DateTime.UtcNow;
    }
}