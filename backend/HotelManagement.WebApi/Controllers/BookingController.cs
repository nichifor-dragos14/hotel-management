using HotelManagement.Core.Abstractions;
using HotelManagement.Core.Bookings;
using HotelManagement.Core.EmailService;
using HotelManagement.WebApi.Authorize;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace HotelManagement.WebApi.Controllers;

[Route("bookings")]
[ApiController]
[AuthorizeRoles(Core.Users.Role.Client)]
public class BookingController(IEmailService _emailService) : ControllerBase
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

    [HttpGet("{id}")]
    public async Task<Results<Ok<BookingDetails>, NotFound, BadRequest>> GetOne(
        Guid id,
        [FromServices] IQueryHandler<OneBookingQuery, BookingDetails> queryService,
        CancellationToken cancellationToken)
    {
        if (id == Guid.Empty)
            return TypedResults.BadRequest();


        return await queryService.ExecuteAsync(new OneBookingQuery(id), cancellationToken) switch
        {
            { } hotel => TypedResults.Ok(hotel),
            _ => TypedResults.NotFound()
        };
    }

    [HttpPost]
    public async Task<Results<Ok<Guid>, BadRequest>> Create(
       [FromBody] CreateBookingCommand command,
       [FromServices] ICommandHandler<CreateBookingCommand, Guid?> commandHandler,
       CancellationToken cancellationToken
    )
    {
        string host = HttpContext.Request.Host.Host;
        int port = HttpContext.Request.Host.Port ?? 80;

        var id = await commandHandler.ExecuteAsync(command, cancellationToken);

        switch (id)
        {
            case { } validId:
                await _emailService.ComposeBookingConfirmationEmail(
                    command.UserDetails.FirstName,
                    command.UserDetails.LastName,
                    command.UserDetails.Email,
                    command.StartDate,
                    command.EndDate,
                    host,
                    port);

                return TypedResults.Ok(validId);

            default: 
                return TypedResults.BadRequest();
        }
    }

    [HttpPatch]
    public async Task<Results<Ok<Guid>, BadRequest>> Update(
        [FromBody] UpdateBookingCommand command,
        [FromServices] ICommandHandler<UpdateBookingCommand, Guid?> commandHandler,
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
    public async Task<Results<Ok, NotFound>> Delete(
        Guid id,
        [FromServices] ICommandHandler<DeleteBookingCommand, bool> commandHandler,
        CancellationToken cancellationToken)
    {
        bool result = await commandHandler.ExecuteAsync(new DeleteBookingCommand(id), cancellationToken);

        return result switch
        {
            true => TypedResults.Ok(),
            false => TypedResults.NotFound()
        };
    }
}