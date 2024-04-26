using HotelManagement.Core.Abstractions;
using HotelManagement.Core.Users;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace HotelManagement.WebApi.Controllers;

[Route("auth")]
[ApiController]
public class AuthController(IConfiguration _configuration) : ControllerBase
{
    [HttpPost("login")]
    public async Task<Results<Ok<string>, BadRequest>> LoginAsync(
        [FromBody] LoginModel loginModel,
        [FromServices] IQueryHandler<LoginQuery, AccountModel> queryService,
        CancellationToken cancellationToken)
    {
        AccountModel? user = await queryService.ExecuteAsync(new LoginQuery(loginModel), cancellationToken);

        if (user == null)
        {
            return TypedResults.BadRequest();
        }

        var token = GenerateJwtToken(user);

        return TypedResults.Ok(token);
    }

    [HttpPost("register")]
    public async Task<Results<Ok<Guid>, BadRequest>> RegisterAsync(
       [FromBody] RegisterCommand command,
       [FromServices] ICommandHandler<RegisterCommand, Guid?> commandHandler,
       CancellationToken cancellationToken
    )
    {
        return await commandHandler.ExecuteAsync(command, cancellationToken) switch
        {
            { } id => TypedResults.Ok(id),
            _ => TypedResults.BadRequest()
        };
    }

    private string GenerateJwtToken(AccountModel user)
    {
        var secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:SecretKey"]));
        var signIncredentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);

        var issuer = _configuration["JWT:Issuer"];
        var audience = _configuration["JWT:Audience"];

        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new(ClaimTypes.Email, user.Email),
            new(ClaimTypes.Role, user.Role.ToString())
        };

        var tokenOptions = new JwtSecurityToken(
            claims: claims,
            signingCredentials: signIncredentials,
            issuer: issuer,
            audience: audience,
            expires: DateTime.UtcNow.AddDays(7)
        );

        var tokenString = new JwtSecurityTokenHandler().WriteToken(tokenOptions);

        return tokenString;
    }
}
