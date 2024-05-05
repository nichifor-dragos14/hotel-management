using HotelManagement.Core.Discounts;
using HotelManagement.Core.Reports;
using HotelManagement.Core.Reviews;
using HotelManagement.Core.Rooms;

namespace HotelManagement.Core.Properties;

public class Property
{
    private Property(
        string name,
        PropertyType type,
        string description,
        string location,
        string email,
        string phoneNumber,
        int rating,
        bool prepaymentNeeded,
        bool hasFreeWiFi,
        bool hasParking,
        bool hasKitchen,
        bool hasPool,
        bool hasRestaurant,
        bool hasFitnessCenter,
        bool hasRoomService,
        bool hasPetFriendlyPolicy,
        bool hasBreakfast,
        bool hasFreeCancellation,
        string pictureUrls,
        DateTime createdOn,
        DateTime updatedOn
    )
    {
        Name = name;
        Type = type;
        Description = description;
        Location = location;
        Email = email;
        PhoneNumber = phoneNumber;
        Rating = rating;
        PrepaymentNeeded = prepaymentNeeded;
        HasFreeWiFi = hasFreeWiFi;
        HasParking = hasParking;
        HasKitchen = hasKitchen;
        HasPool = hasPool;
        HasRestaurant = hasRestaurant;
        HasFitnessCenter = hasFitnessCenter;
        HasRoomService = hasRoomService;
        HasPetFriendlyPolicy = hasPetFriendlyPolicy;
        HasBreakfast = hasBreakfast;
        HasFreeCancellation = hasFreeCancellation;    
        PictureUrls = pictureUrls;
        CreatedOn = createdOn;
        UpdatedOn = updatedOn;
    }

    public Guid Id { get; }

    public string Name { get; private set; }

    public PropertyType Type { get; private set; }

    public string Description { get; private set; }

    public string Location { get; private set; }

    public string Email { get; private set; }

    public string PhoneNumber { get; private set; }

    public int Rating { get; private set; }

    public bool PrepaymentNeeded { get; private set; }

    public bool HasFreeWiFi { get; private set; }

    public bool HasParking { get; private set; }

    public bool HasKitchen { get; private set; }

    public bool HasPool { get; private set; }

    public bool HasRestaurant { get; private set; }

    public bool HasFitnessCenter { get; private set; }

    public bool HasRoomService { get; private set; }

    public bool HasPetFriendlyPolicy { get; private set; }

    public bool HasBreakfast { get; private set; }

    public bool HasFreeCancellation { get; private set; }

    public string PictureUrls { get; private set; }

    public DateTime CreatedOn { get; private set; }

    public DateTime UpdatedOn { get; private set; }

    public virtual List<Discount> Discounts { get; private init; }

    public virtual List<Room> Rooms { get; private init; }

    public virtual List<Review> Reviews { get; private init; }

    public virtual List<Report> Reports { get; private init; }

    public static Property Create(
        string name,
        PropertyType type,
        string description,
        string location,
        string email,
        string phoneNumber,
        int rating,
        bool prepaymentNeeded,
        bool hasFreeWiFi,
        bool hasParking,
        bool hasKitchen,
        bool hasPool,
        bool hasRestaurant,
        bool hasFitnessCenter,
        bool hasRoomService,
        bool hasPetFriendlyPolicy,
        bool hasBreakfast,
        bool hasFreeCancellation,
        string pictureUrls
    )
    {
        return new Property(
            name,
            type,
            description,
            location,
            email,
            phoneNumber,
            rating,
            prepaymentNeeded,
            hasFreeWiFi, 
            hasParking,
            hasKitchen,
            hasPool,
            hasRestaurant,
            hasFitnessCenter,
            hasRoomService,
            hasPetFriendlyPolicy,
            hasBreakfast,
            hasFreeCancellation,  
            pictureUrls,
            DateTime.UtcNow,
            DateTime.UtcNow 
        )
        {
            Rooms = [],
            Reviews = [],
            Reports = []
        };
    }

    public void Update(
        string name,
        string description,
        string email,
        string phoneNumber,
        int rating,
        bool prepaymentNeeded,
        bool hasFreeWiFi,
        bool hasParking,
        bool hasKitchen,
        bool hasPool,
        bool hasRestaurant,
        bool hasFitnessCenter,
        bool hasRoomService,
        bool hasPetFriendlyPolicy,
        bool hasBreakfast,
        bool hasFreeCancellation,
        string imageUrls
    )
    {
        Name = name;
        Description = description;
        Email = email;
        PhoneNumber = phoneNumber;
        Rating = rating;
        PrepaymentNeeded = prepaymentNeeded;
        HasFreeWiFi = hasFreeWiFi;
        HasParking = hasParking;
        HasKitchen = hasKitchen;
        HasPool = hasPool;
        HasRestaurant = hasRestaurant;
        HasFitnessCenter = hasFitnessCenter;
        HasRoomService = hasRoomService;
        HasPetFriendlyPolicy = hasPetFriendlyPolicy;
        HasBreakfast = hasBreakfast;
        HasFreeCancellation = hasFreeCancellation;
        PictureUrls = imageUrls;
        UpdatedOn = DateTime.UtcNow;
    }
}