using HotelManagement.Core.Abstractions;
using HotelManagement.Core.EmailService;
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
public class AuthController(IConfiguration _configuration, IEmailService _emailService) : ControllerBase
{
    [HttpPost("login")]
    public async Task<Results<Ok<string>, BadRequest<string>>> LoginAsync(
        [FromServices] IQueryHandler<LoginQuery, AccountModel> queryService,
        [FromBody] LoginModel loginModel,
        CancellationToken cancellationToken)
    {
        AccountModel? user = await queryService.ExecuteAsync(new LoginQuery(loginModel), cancellationToken);

        if (user == null)
        {
            return TypedResults.BadRequest("The email or password you entered is incorrect");
        }

        var token = GenerateJwtToken(user);

        return TypedResults.Ok(token);
    }

    [HttpPost("register")]
    public async Task<Results<Ok<Guid>, BadRequest<string>>> RegisterAsync(
        [FromServices] ICommandHandler<RegisterCommand, Guid?> commandHandler,
        [FromBody] RegisterCommand command,
        CancellationToken cancellationToken)
    {
        string host = HttpContext.Request.Host.Host;
        int port = HttpContext.Request.Host.Port ?? 80;

        var token = await _emailService.SendAccountValidationEmail(command.Email, command.FirstName, command.LastName, host, port);

        if (token == null)
        {
            return TypedResults.BadRequest("The email is already in use");
        }

        var profilePicture = _configuration["GoogleDriveOptions:DefaultProfilePicture"];

        var newCommand = new RegisterCommand
            (command.FirstName,
            command.LastName, 
            command.Email, 
            command.PhoneNumber,
            command.Nationality,
            command.Gender, 
            command.Address,
            command.DateOfBirth, 
            command.Password,
            profilePicture,
            token,
            command.Role
        );

        return await commandHandler.ExecuteAsync(newCommand, cancellationToken) switch
        {
            { } id => TypedResults.Ok(id),
            _ => TypedResults.BadRequest("")
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

    [HttpGet("get-activation")]
    public async Task<Results<Ok<Guid>, NotFound, BadRequest>> GetActivation(
        [FromServices] IQueryHandler<ActivateAccountUserQuery, Guid> queryService,
        string email,
        string token,
        CancellationToken cancellationToken)
    {
        return await queryService.ExecuteAsync(new ActivateAccountUserQuery(email, token), cancellationToken) switch
        {
            { } result => TypedResults.Ok(result),
        };
    }

    [HttpPost("activate")]
    public async Task<Results<Ok<Guid?>, BadRequest>> ActivateAccount(
        [FromServices] ICommandHandler<ActivateAccountCommand, Guid?> commandHandler,
        [FromBody] ActivateAccountCommand command,
        CancellationToken cancellationToken)
    {
        var result = await commandHandler.ExecuteAsync(command, cancellationToken);

        if (result == null)
        {
            return TypedResults.BadRequest();
        }

        return TypedResults.Ok(result);
    }
}
