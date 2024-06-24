using HotelManagement.Core.Abstractions;
using HotelManagement.Core.Properties;
using HotelManagement.Core.Rooms;
using HotelManagement.WebApi.Authorize;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace HotelManagement.WebApi.Controllers;

[Route("rooms")]
[ApiController]
public class RoomController : Controller
{
    [HttpGet]
    [AuthorizeRoles(Core.Users.Role.Admin, Core.Users.Role.Owner)]
    public async Task<Results<Ok<IPaginatedResult<RoomSummary>>, NotFound>> GetAll(
        [FromServices] IQueryHandler<AllRoomSummariesQuery, IPaginatedResult<RoomSummary>> queryService,
        int from,
        int to,
        Guid propertyId,
        CancellationToken cancelationToken)
    {
        return TypedResults.Ok(await queryService.ExecuteAsync(new AllRoomSummariesQuery(from, to, propertyId), cancelationToken));
    }

    [HttpGet("types")]
    [AuthorizeRoles(Core.Users.Role.Owner)]
    public async Task<Results<Ok<IEnumerable<RoomTypeSummary>>, NotFound>> GetAllTypes(
        [FromServices] IQueryHandler<AllRoomTypesQuery, IEnumerable<RoomTypeSummary>> queryService,
        CancellationToken cancelationToken)
    {
        return TypedResults.Ok(await queryService.ExecuteAsync(new AllRoomTypesQuery(), cancelationToken));
    }

    [HttpGet("ids")]
    [AuthorizeRoles(Core.Users.Role.Client)]
    public async Task<Results<Ok<IEnumerable<RoomPropertyDetails>>, NotFound>> GetAllByIds(
        [FromServices] IQueryHandler<AllRoomsByIdsQuery, IEnumerable<RoomPropertyDetails>> queryService,
        [FromQuery] List<Guid> ids,
        CancellationToken cancelationToken)
    {
        return TypedResults.Ok(await queryService.ExecuteAsync(new AllRoomsByIdsQuery(ids), cancelationToken));
    }

    [HttpGet("{id}")]
    [AuthorizeRoles(Core.Users.Role.Admin, Core.Users.Role.Owner)]
    public async Task<Results<Ok<RoomDetails>, NotFound, BadRequest>> GetOne(
        [FromServices] IQueryHandler<OneRoomQuery, RoomDetails> queryService,
        Guid id,
        CancellationToken cancellationToken)
    {
        if (id == Guid.Empty)
            return TypedResults.BadRequest();


        return await queryService.ExecuteAsync(new OneRoomQuery(id), cancellationToken) switch
        {
            { } result => TypedResults.Ok(result),
            _ => TypedResults.NotFound()
        };
    }

    [HttpPost]
    [AuthorizeRoles(Core.Users.Role.Owner)]
    public async Task<Results<Ok<Guid>, BadRequest>> Create(
        [FromServices] ICommandHandler<CreateRoomCommand, Guid?> commandHandler,
        [FromBody] CreateRoomCommand command,
        CancellationToken cancellationToken)
    {
        return await commandHandler.ExecuteAsync(command, cancellationToken) switch
        {
            { } id => TypedResults.Ok(id),
            _ => TypedResults.BadRequest()
        };
    }

    [HttpPatch]
    [AuthorizeRoles(Core.Users.Role.Admin, Core.Users.Role.Owner)]
    public async Task<Results<Ok<Guid>, BadRequest>> Update(
        [FromServices] ICommandHandler<UpdateRoomCommand, Guid?> commandHandler,
        [FromBody] UpdateRoomCommand command,
        CancellationToken cancellationToken
    )
    {
        return await commandHandler.ExecuteAsync(command, cancellationToken) switch
        {
            { } id => TypedResults.Ok(id),
            _ => TypedResults.BadRequest()
        };
    }

    [HttpDelete("{id}")]
    [AuthorizeRoles(Core.Users.Role.Admin, Core.Users.Role.Owner)]
    public async Task<Results<Ok, NotFound>> Delete(
        [FromServices] ICommandHandler<DeleteRoomCommand, bool> commandHandler,
        Guid id,
        Guid userId,
        CancellationToken cancellationToken)
    {
        bool result = await commandHandler.ExecuteAsync(new DeleteRoomCommand(id, userId), cancellationToken);

        return result switch
        {
            true => TypedResults.Ok(),
            false => TypedResults.NotFound()
        };
    }

}