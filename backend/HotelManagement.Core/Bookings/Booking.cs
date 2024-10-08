﻿using HotelManagement.Core.Reports;
using HotelManagement.Core.Reviews;
using HotelManagement.Core.Rooms;
using HotelManagement.Core.Users;

namespace HotelManagement.Core.Bookings;

public class Booking
{
    private Booking(
        DateTime startDate,
        DateTime endDate,
        double totalPrice,
        string firstNameOnBooking,
        string lastNameOnBooking,
        string emailOnBooking,
        string phoneNumberOnBooking,
        string countryOnBooking,
        string specialMentions,
        string expectedArrival,
        DateTime createdOn,
        DateTime updatedOn
    )
    {
        StartDate = startDate;
        EndDate = endDate;
        TotalPrice = totalPrice;
        FirstNameOnBooking = firstNameOnBooking;
        LastNameOnBooking = lastNameOnBooking;
        EmailOnBooking = emailOnBooking;
        PhoneNumberOnBooking = phoneNumberOnBooking;
        CountryOnBooking = countryOnBooking;
        SpecialMentions = specialMentions;
        ExpectedArrival = expectedArrival;
        CreatedOn = createdOn;
        UpdatedOn = updatedOn;
    }

    public Guid Id { get; }

    public DateTime StartDate { get; private set; }

    public DateTime EndDate { get; private set; }

    public double TotalPrice { get; private set; }

    public string FirstNameOnBooking { get; private set; }

    public string LastNameOnBooking { get; private set; }

    public string EmailOnBooking { get; private set; }

    public string PhoneNumberOnBooking { get; private set; }

    public string CountryOnBooking { get; private set; }

    public string SpecialMentions { get; private set; }

    public string ExpectedArrival { get; private set; }

    public DateTime CreatedOn { get; private set; }

    public DateTime UpdatedOn { get; private set; }

    public virtual User User { get; private init; }

    public virtual Guid UserId { get; private set; }

    public virtual Room Room { get; private init; }

    public virtual Review Review { get; private set; }

    public virtual Report Report { get; private set; }

    public static Booking Create(
        DateTime startDate,
        DateTime endDate,
        double totalPrice,
        string firstNameOnBooking,
        string lastNameOnBooking,
        string emailOnBooking,
        string phoneNumberOnBooking,
        string countryOnBooking,
        string specialMentions,
        string expectedArrival,
        User user,
        Room room
    )
    {
        return new Booking(
            startDate,
            endDate,
            totalPrice,
            firstNameOnBooking,
            lastNameOnBooking,
            emailOnBooking,
            phoneNumberOnBooking,
            countryOnBooking,
            specialMentions,
            expectedArrival,
            DateTime.UtcNow,
            DateTime.UtcNow
        )
        {
            User = user,
            Room = room
        };
    }

    public void Update(
        string specialMentions,
        string expectedArrival
    )
    {
        SpecialMentions = specialMentions;
        ExpectedArrival = expectedArrival;
        UpdatedOn = DateTime.UtcNow;
    }
}