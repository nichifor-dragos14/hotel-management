using HotelManagement.Core.Bookings;
using HotelManagement.Core.Reports;
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

    public string FirstName { get; private set; }

    public string LastName { get; private set; }

    public string Email { get; private set; }

    public string PhoneNumber { get; private set; }

    public string Nationality { get; private set; }

    public Gender Gender { get; private set; }

    public string Address { get; private set; }

    public DateTime DateOfBirth { get; private set; }

    public string Password { get; private set; }

    public bool RetainSearchHistory { get; private set; }

    public bool SendOffersOnEmail { get; private set; }

    public string ProfilePicture { get; private set; }

    public DateTime CreatedOn { get; private set; }

    public DateTime UpdatedOn { get; private set; }

    public virtual List<Booking> Bookings { get; private init; }

    public virtual List<Review> Reviews { get; private init; }

    public virtual List<Report> Reports { get; private init; }

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

    public void UpdateDetails(
        string firstName,
        string lastName,
        string phoneNumber,
        string nationality,
        Gender gender,
        string address,
        DateTime dateOfBirth
    )
    {
        FirstName = firstName;
        LastName = lastName;
        PhoneNumber = phoneNumber;
        Nationality = nationality;
        Gender = gender;
        Address = address;
        DateOfBirth = dateOfBirth;
        UpdatedOn = DateTime.UtcNow;
    }

    public void UpdatePreferences(
       bool retainSearchHistory,
       bool sendOffersOnEmail
    )
    {
        RetainSearchHistory = retainSearchHistory;
        SendOffersOnEmail = sendOffersOnEmail;
        UpdatedOn = DateTime.UtcNow;
    }

    public void UpdateProfilePicture(
      string profilePicture
   )
    {
        ProfilePicture = profilePicture;
        UpdatedOn = DateTime.UtcNow;
    }
}