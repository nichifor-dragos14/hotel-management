using HotelManagement.Core.Abstractions;
using HotelManagement.Core.Properties;
using HotelManagement.Core.Rooms;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace HotelManagement.WebApi.Controllers;

[Route("rooms")]
[ApiController]
public class RoomController : Controller
{
    [HttpGet]
    public async Task<Results<Ok<IEnumerable<RoomSummary>>, NotFound>> GetAll(
        [FromServices] IQueryHandler<AllRoomsQuery, IEnumerable<RoomSummary>> queryService,
        CancellationToken cancelationToken)
    {
        return TypedResults.Ok(await queryService.ExecuteAsync(new AllRoomsQuery(), cancelationToken));
    }

    [HttpGet("ids")]
    public async Task<Results<Ok<IEnumerable<RoomPropertyDetails>>, NotFound>> GetAllByIds(
       [FromQuery] List<Guid> ids,
       [FromServices] IQueryHandler<AllRoomsByIdsQuery, IEnumerable<RoomPropertyDetails>> queryService,
       CancellationToken cancelationToken)
    {
        return TypedResults.Ok(await queryService.ExecuteAsync(new AllRoomsByIdsQuery(ids), cancelationToken));
    }
}