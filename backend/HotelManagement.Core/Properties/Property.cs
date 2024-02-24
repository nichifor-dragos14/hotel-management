﻿using HotelManagement.Core.Rooms;

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
        DateTime createdOn,
        DateTime updatedOn,
        bool hasFreeWiFi,
        bool hasParking,
        bool hasPool,
        bool hasRestaurant,
        bool hasFitnessCentre,
        bool hasRoomService,
        bool hasPetFriendlyPolicy,
        bool hasBreakfast,
        bool hasFreeCancellation
    )
    {
        Name = name;
        Type = type;
        Description = description;
        Location = location;
        Email = email;
        PhoneNumber = phoneNumber;
        CreatedOn = createdOn;
        UpdatedOn = updatedOn;
        HasFreeWiFi = hasFreeWiFi;
        HasParking = hasParking;
        HasPool = hasPool;
        HasRestaurant = hasRestaurant;
        HasFitnessCentre = hasFitnessCentre;
        HasRoomService = hasRoomService;
        HasPetFriendlyPolicy = hasPetFriendlyPolicy;
        HasBreakfast = hasBreakfast;
        HasFreeCancellation = hasFreeCancellation;
        IsDeleted = false;
    }

    public Guid Id { get; }

    public string Name { get; private set; }

    public PropertyType Type { get; private set; }

    public string Description { get; private set; }

    public string Location { get; private set; }

    public string Email { get; private set; }

    public string PhoneNumber { get; private set; }

    public bool HasFreeWiFi { get; private set; }

    public bool HasParking { get; private set; }

    public bool HasPool { get; private set; }

    public bool HasRestaurant { get; private set; }

    public bool HasFitnessCentre { get; private set; }

    public bool HasRoomService { get; private set; }

    public bool HasPetFriendlyPolicy { get; private set; }

    public bool HasBreakfast { get; private set; }

    public bool HasFreeCancellation { get; private set; }

    public DateTime CreatedOn { get; private set; }

    public DateTime UpdatedOn { get; private set; }

    public bool IsDeleted { get; private set; }

    public virtual List<Room> Rooms { get; private init; }

    public static Property Create(
        string name,
        PropertyType type,
        string description,
        string location,
        string email,
        string phoneNumber,
        bool hasFreeWiFi,
        bool hasParking,
        bool hasPool,
        bool hasRestaurant,
        bool hasFitnessCentre,
        bool hasRoomService,
        bool hasPetFriendlyPolicy,
        bool hasBreakfast,
        bool hasFreeCancellation
    )
    {
        return new Property(
            name,
            type,
            description,
            location,
            email,
            phoneNumber,
            DateTime.UtcNow,
            DateTime.UtcNow,
            hasFreeWiFi, hasParking,
            hasPool,
            hasRestaurant,
            hasFitnessCentre,
            hasRoomService,
            hasPetFriendlyPolicy,
            hasBreakfast,
            hasFreeCancellation
        )
        {
            Rooms = []
        };
    }

    public Room CreateRoom(
        int number,
        RoomType type,
        bool hasPrivateBathroom,
        bool hasTowels,
        bool hasHairdryer,
        bool hasAirConditioning,
        bool hasBalcony,
        bool hasKitchen,
        bool hasRefrigerator,
        bool hasSeaView
    )
    {
        return new Room(
            number,
            type,
            hasPrivateBathroom,
            hasTowels,
            hasHairdryer,
            hasAirConditioning,
            hasBalcony,
            hasKitchen,
            hasRefrigerator,
            hasSeaView,
            DateTime.UtcNow,
            DateTime.UtcNow
        )
        {
            Property = this
        };
    }

    public void Update(
        string name,
        string description,
        string email,
        string phoneNumber,
        bool hasFreeWiFi,
        bool hasParking,
        bool hasPool,
        bool hasRestaurant,
        bool hasFitnessCentre,
        bool hasRoomService,
        bool hasPetFriendlyPolicy,
        bool hasBreakfast,
        bool hasFreeCancellation
    )
    {
        Name = name;
        Description = description;
        Email = email;
        PhoneNumber = phoneNumber;
        HasFreeWiFi = hasFreeWiFi;
        HasParking = hasParking;
        HasPool = hasPool;
        HasRestaurant = hasRestaurant;
        HasFitnessCentre = hasFitnessCentre;
        HasRoomService = hasRoomService;
        HasPetFriendlyPolicy = hasPetFriendlyPolicy;
        HasBreakfast = hasBreakfast;
        HasFreeCancellation = hasFreeCancellation;
        UpdatedOn = DateTime.UtcNow;
    }
}