namespace HotelManagement.Core.Properties.Filters;

public class PropertyFiltersOptional
{
    public Guid? LoggedUserId { get; set; }

    public bool HasFreeWiFi { get; set; }

    public bool HasParking { get; set; }

    public bool HasRoomService { get; set; }

    public bool HasRestaurant { get; set; }

    public bool HasBreakfast { get; set; }

    public bool HasKitchen { get; set; }

    public bool HasPool { get; set; }

    public bool HasFitnessCenter { get; set; }

    public bool HasPetFriendlyPolicy { get; set; }

    public bool HasFreeCancellation { get; set; }

    public bool HasPrivateBathroom { get; set; }

    public bool HasAirConditioning { get; set; }

    public bool HasTowels { get; set; }

    public bool HasHairdryer { get; set; }

    public bool HasBalcony { get; set; }

    public bool HasSeaView { get; set; }

    public bool HasRefrigerator { get; set; }

    public bool RatingOver9 { get; set; }

    public bool RatingOver8 { get; set; }

    public bool RatingOver7 { get; set; }

    public bool RatingOver6 { get; set; }

    public bool Over1000 { get; set; }

    public bool Between500and1000 { get; set; }

    public bool Between250and500 { get; set; }

    public bool Under250 { get; set; }
}
