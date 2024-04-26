using HotelManagement.Core.Abstractions;
using HotelManagement.Core.FileStorageService;
using HotelManagement.Core.Users;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using HotelManagement.WebApi.DTOs;


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

    [HttpPatch("upload")]
    public async Task<Results<Ok<Guid>, BadRequest<string>>> UploadFile(
        [FromServices] ICommandHandler<UpdateProfilePictureCommand, Guid?> commandHandler,
        [FromForm] UpdateUserPictureDTO updateUserPictureDTO,
        CancellationToken cancellationToken
    )
    {
        if (updateUserPictureDTO.File == null || updateUserPictureDTO.File.Length == 0)
        {
            return TypedResults.BadRequest("No profile picture was uploaded");
        }

        var imageUrl = await _storageService.UploadImage(updateUserPictureDTO.File.OpenReadStream());

        if (imageUrl == null)
        {
            return TypedResults.BadRequest("The image could not be uploaded");
        }

        var command = new UpdateProfilePictureCommand(updateUserPictureDTO.UserId, imageUrl.Url);

        return await commandHandler.ExecuteAsync(command, cancellationToken) switch
        {
            { } id => TypedResults.Ok(id),
            _ => TypedResults.BadRequest("No user logged in")
        };
    }
}