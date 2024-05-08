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
    [AuthorizeRoles(Core.Users.Role.Admin)]
    public async Task<Results<Ok<IEnumerable<RoomTypeSummary>>, NotFound>> GetAllTypes(
       [FromServices] IQueryHandler<AllRoomTypesQuery, IEnumerable<RoomTypeSummary>> queryService,
       CancellationToken cancelationToken)
    {
        return TypedResults.Ok(await queryService.ExecuteAsync(new AllRoomTypesQuery(), cancelationToken));
    }

    [HttpGet("ids")]
    [AuthorizeRoles(Core.Users.Role.Client)]
    public async Task<Results<Ok<IEnumerable<RoomPropertyDetails>>, NotFound>> GetAllByIds(
       [FromQuery] List<Guid> ids,
       [FromServices] IQueryHandler<AllRoomsByIdsQuery, IEnumerable<RoomPropertyDetails>> queryService,
       CancellationToken cancelationToken)
    {
        return TypedResults.Ok(await queryService.ExecuteAsync(new AllRoomsByIdsQuery(ids), cancelationToken));
    }

    [HttpGet("{id}")]
    [AuthorizeRoles(Core.Users.Role.Admin)]
    public async Task<Results<Ok<RoomDetails>, NotFound, BadRequest>> GetOne(
        Guid id,
        [FromServices] IQueryHandler<OneRoomQuery, RoomDetails> queryService,
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
    [AuthorizeRoles(Core.Users.Role.Admin)]
    public async Task<Results<Ok<Guid>, BadRequest>> Create(
       [FromBody] CreateRoomCommand command,
       [FromServices] ICommandHandler<CreateRoomCommand, Guid?> commandHandler,
       CancellationToken cancellationToken
   )
    {
        return await commandHandler.ExecuteAsync(command, cancellationToken) switch
        {
            { } id => TypedResults.Ok(id),
            _ => TypedResults.BadRequest()
        };
    }

    [HttpPatch]
    [AuthorizeRoles(Core.Users.Role.Admin)]
    public async Task<Results<Ok<Guid>, BadRequest>> Update(
        [FromBody] UpdateRoomCommand command,
        [FromServices] ICommandHandler<UpdateRoomCommand, Guid?> commandHandler,
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
    [AuthorizeRoles(Core.Users.Role.Admin)]
    public async Task<Results<Ok, NotFound>> Delete(
        Guid id,
        [FromServices] ICommandHandler<DeleteRoomCommand, bool> commandHandler,
        CancellationToken cancellationToken)
    {
        bool result = await commandHandler.ExecuteAsync(new DeleteRoomCommand(id), cancellationToken);

        return result switch
        {
            true => TypedResults.Ok(),
            false => TypedResults.NotFound()
        };
    }

}