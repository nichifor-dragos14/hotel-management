using HotelManagement.Core.Abstractions;

namespace HotelManagement.Core.Users;

public record LoginModel(
   string Email,
   string Password
);

public record AccountModel(
    string Email
);

public record LoginQuery(LoginModel LoginModel) : IQuery<AccountModel?>;

internal class LoginQueryHandler(
    IQueryFacade facade
) : IQueryHandler<LoginQuery, AccountModel>
{
    public async Task<AccountModel> ExecuteAsync(
        LoginQuery query,
        CancellationToken cancellationToken)
    {
        return (from user in facade.Of<User>()
                where user.Email == query.LoginModel.Email && user.Password == query.LoginModel.Password
                select new AccountModel(user.Email)
                ).FirstOrDefault();
    }
}