using HotelManagement.Core.Abstractions;

namespace HotelManagement.Core.Users;

public record UserDetails(
    Guid Id,
    string FirstName,
    string LastName,
    string Email,
    string PhoneNumber,
    string Nationality,
    Gender Gender,
    string Address,
    DateTime DateOfBirth,
    bool RetainSearchHistory,
    bool SendOffersOnEmail,
    string ProfilePicture,
    int GeniusXp,
    GeniusLevel GeniusLevel
);

public record OneUserQuery(
    string Email
) : IQuery<UserDetails>;

internal class OneUserQueryHandler(
    IQueryFacade facade
) : IQueryHandler<OneUserQuery, UserDetails>
{
    public async Task<UserDetails> ExecuteAsync(
        OneUserQuery query,
        CancellationToken cancellationToken)
    {
        return (from user in facade.Of<User>()
                where user.Email == query.Email
                select new UserDetails(
                    user.Id,
                    user.FirstName,
                    user.LastName,
                    user.Email,
                    user.PhoneNumber,
                    user.Nationality,
                    user.Gender,
                    user.Address,
                    user.DateOfBirth,
                    user.RetainSearchHistory,
                    user.SendOffersOnEmail,
                    user.ProfilePicture,
                    user.GeniusXp,
                    user.GeniusLevel
                )).FirstOrDefault();
    }
}