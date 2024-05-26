using HotelManagement.Core.Abstractions;
using HotelManagement.Core.Statistics;
using HotelManagement.WebApi.Authorize;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace HotelManagement.WebApi.Controllers;

[Route("statistics")]
[ApiController]
public class StatisticsController : ControllerBase
{
    
    [AuthorizeRoles(Core.Users.Role.Owner)]
    [HttpGet("property/{id}")]
    public async Task<Results<Ok<PropertyStatistics>, NotFound, BadRequest>> GetPropertyStatistics(
        [FromServices] IQueryHandler<PropertyStatisticsQuery, PropertyStatistics> queryService,
        Guid id,
        CancellationToken cancellationToken)
    {
        if (id == Guid.Empty)
        {
            return TypedResults.BadRequest();
        }
           
        return await queryService.ExecuteAsync(new PropertyStatisticsQuery(id), cancellationToken) switch
        {
            { } result => TypedResults.Ok(result),
            _ => TypedResults.NotFound()
        };
    }

    [AuthorizeRoles(Core.Users.Role.Owner)]
    [HttpGet("room/{id}")]
    public async Task<Results<Ok<RoomStatistics>, NotFound, BadRequest>> GetRoomStatistics(
        [FromServices] IQueryHandler<RoomStatisticsQuery, RoomStatistics> queryService,
        Guid id,
        CancellationToken cancellationToken)
    {
        if (id == Guid.Empty)
        {
            return TypedResults.BadRequest();
        }

        return await queryService.ExecuteAsync(new RoomStatisticsQuery(id), cancellationToken) switch
        {
            { } result => TypedResults.Ok(result),
            _ => TypedResults.NotFound()
        };
    }

    [AuthorizeRoles(Core.Users.Role.Client)]
    [HttpGet("user/{id}")]
    public async Task<Results<Ok<UserStatistics>, NotFound, BadRequest>> GetUserStatistics(
        [FromServices] IQueryHandler<UserStatisticsQuery, UserStatistics> queryService,
        Guid id,
        CancellationToken cancellationToken)
    {
        if (id == Guid.Empty)
        {
            return TypedResults.BadRequest();
        }
            
        return await queryService.ExecuteAsync(new UserStatisticsQuery(id), cancellationToken) switch
        {
            { } result => TypedResults.Ok(result),
            _ => TypedResults.NotFound()
        };
    }
}
