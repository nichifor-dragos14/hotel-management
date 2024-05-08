using HotelManagement.Core.Abstractions;

namespace HotelManagement.Core.Users;

public record GetUserPasswordQuery(Guid Id) : IQuery<string>;

internal class GetUserPasswordQueryHandler(
    IQueryFacade facade
) : IQueryHandler<GetUserPasswordQuery, string>
{
    public async Task<string> ExecuteAsync(
        GetUserPasswordQuery query,
        CancellationToken cancellationToken)
    {
        return (from user in facade.Of<User>()
                where user.Id == query.Id
                select user.Password
                ).FirstOrDefault();
    }
}