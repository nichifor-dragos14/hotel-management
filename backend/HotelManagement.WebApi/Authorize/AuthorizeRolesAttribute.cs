using HotelManagement.Core.Users;
using Microsoft.AspNetCore.Authorization;

namespace HotelManagement.WebApi.Authorize;

public class AuthorizeRolesAttribute : AuthorizeAttribute
{
    public AuthorizeRolesAttribute(params Role[] roles)
    {
        var allowedRoles = roles.Select(r => Enum.GetName(typeof(Role), r));

        Roles = string.Join(",", allowedRoles);
    }
}
