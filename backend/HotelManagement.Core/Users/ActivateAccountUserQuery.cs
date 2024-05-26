using HotelManagement.Core.Abstractions;

namespace HotelManagement.Core.Users;

public record ActivateAccountUserQuery(string Email, string Token) : IQuery<Guid>;

internal class ActivateAccountUserQueryHandler(
    IQueryFacade facade
) : IQueryHandler<ActivateAccountUserQuery, Guid>
{
    public async Task<Guid> ExecuteAsync(
        ActivateAccountUserQuery query,
        CancellationToken cancellationToken)
    {
        return (from user in facade.Of<User>()
                where user.ActivationToken == query.Token && user.Email == query.Email && user.IsConfirmed == false
                select user.Id
                ).FirstOrDefault();
    }
}