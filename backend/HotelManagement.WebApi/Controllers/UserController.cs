using HotelManagement.Core.Abstractions;
using HotelManagement.Core.Properties;
using HotelManagement.Core.Users;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace HotelManagement.WebApi.Controllers;

[Route("users")]
[ApiController]
public class UserController : Controller
{
    [HttpGet("{email}")]
    public async Task<Results<Ok<UserDetails>, NotFound, BadRequest>> GetOne(
       string email,
       [FromServices] IQueryHandler<OneUserQuery, UserDetails> queryService,
       CancellationToken cancellationToken)
    {
        if (email.IsNullOrEmpty())
        {
            return TypedResults.BadRequest();
        }

        return await queryService.ExecuteAsync(new OneUserQuery(email), cancellationToken) switch
        {
            { } hotel => TypedResults.Ok(hotel),
            _ => TypedResults.NotFound()
        };
    }

    [HttpPatch("details")]
    public async Task<Results<Ok<Guid>, BadRequest>> UpdateDetails(
       [FromBody] UpdateUserDetailsCommand command,
       [FromServices] ICommandHandler<UpdateUserDetailsCommand, Guid?> commandHandler,
       CancellationToken cancellationToken)
    {
        return await commandHandler.ExecuteAsync(command, cancellationToken) switch
        {
            { } id => TypedResults.Ok(id),
            _ => TypedResults.BadRequest()
        };
    }

    [HttpPatch("preferences")]
    public async Task<Results<Ok<Guid>, BadRequest>> UpdatePreferences(
       [FromBody] UpdateUserPreferencesCommand command,
       [FromServices] ICommandHandler<UpdateUserPreferencesCommand, Guid?> commandHandler,
       CancellationToken cancellationToken)
    {
        return await commandHandler.ExecuteAsync(command, cancellationToken) switch
        {
            { } id => TypedResults.Ok(id),
            _ => TypedResults.BadRequest()
        };
    }
}