using HotelManagement.Core.Abstractions;
using HotelManagement.Core.Bookings;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace HotelManagement.WebApi.Controllers;

[Route("bookings")]
[ApiController]
public class BookingController : ControllerBase
{
    [HttpGet("past")]
    public async Task<Results<Ok<IPaginatedResult<BookingSummary>>, NotFound>> GetAllPastBookings(
    [FromServices] IQueryHandler<AllPastBookingSummariesQuery, IPaginatedResult<BookingSummary>> queryService,
    Guid userId,
    int from,
    int to,
    CancellationToken cancelationToken)
    {
        return TypedResults.Ok(await queryService.ExecuteAsync(new AllPastBookingSummariesQuery(userId, from, to), cancelationToken));
    }

    [HttpGet("upcoming")]
    public async Task<Results<Ok<IPaginatedResult<BookingSummary>>, NotFound>> GetAllUpcomingBookings(
    [FromServices] IQueryHandler<AllUpcomingBookingSummariesQuery, IPaginatedResult<BookingSummary>> queryService,
    Guid userId,
    int from,
    int to,
    CancellationToken cancelationToken)
    {
        return TypedResults.Ok(await queryService.ExecuteAsync(new AllUpcomingBookingSummariesQuery(userId, from, to), cancelationToken));
    }


    [HttpPost]
    public async Task<Results<Ok<Guid>, BadRequest>> Create(
       [FromBody] CreateBookingCommand command,
       [FromServices] ICommandHandler<CreateBookingCommand, Guid?> commandHandler,
       CancellationToken cancellationToken
   )
    {
        return await commandHandler.ExecuteAsync(command, cancellationToken) switch
        {
            { } id => TypedResults.Ok(id),
            _ => TypedResults.BadRequest()
        };
    }
}