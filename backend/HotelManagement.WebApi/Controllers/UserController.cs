﻿using HotelManagement.Core.Abstractions;
using HotelManagement.Core.FileStorageService;
using HotelManagement.Core.Users;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using HotelManagement.WebApi.DTOs;
using HotelManagement.WebApi.Authorize;

namespace HotelManagement.WebApi.Controllers;

[Route("users")]
[ApiController]
public class UserController(IFileStorageService _storageService) : Controller
{
    [HttpGet("{email}")]
    [AuthorizeRoles(Core.Users.Role.Client, Core.Users.Role.Admin, Core.Users.Role.Owner)]
    public async Task<Results<Ok<UserDetails>, NotFound, BadRequest>> GetOne(
        [FromServices] IQueryHandler<OneUserQuery, UserDetails> queryService,
        string email,
        CancellationToken cancellationToken)
    {
        if (email.IsNullOrEmpty())
        {
            return TypedResults.BadRequest();
        }

        return await queryService.ExecuteAsync(new OneUserQuery(email), cancellationToken) switch
        {
            { } result => TypedResults.Ok(result),
            _ => TypedResults.NotFound()
        };
    }

    [HttpPatch("details")]
    [AuthorizeRoles(Core.Users.Role.Client, Core.Users.Role.Admin, Core.Users.Role.Owner)]
    public async Task<Results<Ok<Guid>, BadRequest>> UpdateDetails(
        [FromServices] ICommandHandler<UpdateUserDetailsCommand, Guid?> commandHandler,
        [FromBody] UpdateUserDetailsCommand command,
        CancellationToken cancellationToken)
    {
        return await commandHandler.ExecuteAsync(command, cancellationToken) switch
        {
            { } id => TypedResults.Ok(id),
            _ => TypedResults.BadRequest()
        };
    }

    [HttpPatch("preferences")]
    [AuthorizeRoles(Core.Users.Role.Client)]
    public async Task<Results<Ok<Guid>, BadRequest>> UpdatePreferences(
        [FromServices] ICommandHandler<UpdateUserPreferencesCommand, Guid?> commandHandler,
        [FromBody] UpdateUserPreferencesCommand command,
        CancellationToken cancellationToken)
    {
        return await commandHandler.ExecuteAsync(command, cancellationToken) switch
        {
            { } id => TypedResults.Ok(id),
            _ => TypedResults.BadRequest()
        };
    }

    [HttpPatch("upload")]
    [AuthorizeRoles(Core.Users.Role.Client, Core.Users.Role.Admin, Core.Users.Role.Owner)]
    public async Task<Results<Ok<Guid>, BadRequest<string>>> UploadFile(
        [FromServices] ICommandHandler<UpdateProfilePictureCommand, Guid?> commandHandler,
        [FromForm] UpdateUserPictureDTO updateUserPictureDTO,
        CancellationToken cancellationToken)
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

    [HttpPatch("password")]
    [AuthorizeRoles(Core.Users.Role.Client, Core.Users.Role.Admin, Core.Users.Role.Owner)]
    public async Task<Results<Ok<Guid>, BadRequest>> UpdatePassword(
        [FromServices] ICommandHandler<UpdateUserPasswordCommand, Guid?> commandHandler,
        [FromBody] UpdateUserPasswordCommand command,
        CancellationToken cancellationToken)
    {
        return await commandHandler.ExecuteAsync(command, cancellationToken) switch
        {
            { } id => TypedResults.Ok(id),
            _ => TypedResults.BadRequest()
        };
    }
}