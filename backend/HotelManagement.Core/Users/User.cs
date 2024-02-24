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
        IsDeleted = false;
    }

    public Guid Id { get; }

    public string FirstName { get; private set; }

    public string LastName { get; private set; }

    public DateTime CreatedOn { get; private set; }

    public DateTime UpdatedOn { get; private set; }

    public bool IsDeleted { get; private set; }

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
            //Users = new List<User>()
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
        IsDeleted = false;
    }
}