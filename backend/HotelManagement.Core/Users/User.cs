﻿using HotelManagement.Core.Bookings;
using HotelManagement.Core.Reviews;

namespace HotelManagement.Core.Users;

public class User
{
    private User(
        string firstName,
        string lastName,
        DateTime createdOn,
        DateTime updatedOn
    )
    {
        FirstName = firstName;
        LastName = lastName;
        CreatedOn = createdOn;
        UpdatedOn = updatedOn;
    }

    public Guid Id { get; }

    public string Email { get; private set; }

    public string Password { get; private set; }

    public string FirstName { get; private set; }

    public string LastName { get; private set; }

    public string Nationality { get; private set; }

    public DateTime CreatedOn { get; private set; }

    public DateTime UpdatedOn { get; private set; }

    public virtual List<Booking> Bookings { get; private init; }

    public virtual List<Review> Reviews { get; private init; }

    public static User Create(
        string firstName,
        string lastName
    )
    {
        return new User(
            firstName,
            lastName,
            DateTime.UtcNow,
            DateTime.UtcNow
        )
        {
            Bookings = []
        };
    }

    public void Update(
        string firstName,
        string lastName
    )
    {
        FirstName = firstName;
        LastName = lastName;
        UpdatedOn = DateTime.UtcNow;
    }
}