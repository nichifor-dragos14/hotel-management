using HotelManagement.Core.Abstractions;
using HotelManagement.Core.FileStorageService;
using HotelManagement.Core.Properties;
using HotelManagement.Core.Users;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;
using System.Threading;

namespace HotelManagement.WebApi.Controllers;

[Route("users")]
[ApiController]
public class UserController(IFileStorageService _storageService) : Controller
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

    [HttpPost("upload")]
    public async Task<Results<Ok<Guid>, BadRequest>> UploadFile(
        [FromServices] ICommandHandler<UpdateProfilePictureCommand, Guid?> commandHandler,
        Guid userId,
        IFormFile file,
        CancellationToken cancellationToken
    )
    {
        if (file == null || file.Length == 0)
        {
            return TypedResults.BadRequest();
        }

        var imageUrl = await _storageService.UploadImage(file.OpenReadStream());

        if (imageUrl == null)
        {
            return TypedResults.BadRequest();
        }

        return await commandHandler.ExecuteAsync(new UpdateProfilePictureCommand(userId, imageUrl.Url), cancellationToken) switch
        {
            { } id => TypedResults.Ok(id),
            _ => TypedResults.BadRequest()
        };
    }
}