using HotelManagement.Core.Abstractions;
using HotelManagement.Core.Utils;

namespace HotelManagement.Core.Users;

public record LoginModel(
   string Email,
   string Password
);

public record AccountModel(
    Guid Id,
    string Email,
    Role Role
);

public record LoginQuery(
    LoginModel LoginModel
) : IQuery<AccountModel?>;

internal class LoginQueryHandler(
    IQueryFacade facade
) : IQueryHandler<LoginQuery, AccountModel>
{
    public async Task<AccountModel> ExecuteAsync(
        LoginQuery query,
        CancellationToken cancellationToken)
    {
        var user = (from u in facade.Of<User>()
                    where u.Email == query.LoginModel.Email
                    select new { u.Id, u.Email, u.Password, u.Role }
                    ).FirstOrDefault();

        if (user != null)
        {     
            var decryptedPassword = PasswordUtility.DecryptPassword(user.Password);

            if (decryptedPassword == query.LoginModel.Password)
            {
                return new AccountModel(user.Id, user.Email, user.Role);
            }       
        }

        return null;
    }
}