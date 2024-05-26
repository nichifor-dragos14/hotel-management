using HotelManagement.Core.Abstractions;
using HotelManagement.Core.Bookings;
using HotelManagement.Core.EmailService;
using HotelManagement.WebApi.Authorize;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace HotelManagement.WebApi.Controllers;

[Route("bookings")]
[ApiController]
public class BookingController(IEmailService _emailService) : ControllerBase
{
    [HttpGet("past")]
    [AuthorizeRoles(Core.Users.Role.Client)]
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
    [AuthorizeRoles(Core.Users.Role.Client)]
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
    [AuthorizeRoles(Core.Users.Role.Client)]
    public async Task<Results<Ok<BookingDetails>, NotFound, BadRequest>> GetOne(
        [FromServices] IQueryHandler<OneBookingQuery, BookingDetails> queryService,
        Guid id,
        CancellationToken cancellationToken)
    {
        if (id == Guid.Empty)
        {
            return TypedResults.BadRequest();
        }

        return await queryService.ExecuteAsync(new OneBookingQuery(id), cancellationToken) switch
        {
            { } result => TypedResults.Ok(result),
            _ => TypedResults.NotFound()
        };
    }

    [HttpGet("{id}/admin")]
    [AuthorizeRoles(Core.Users.Role.Owner)]
    public async Task<Results<Ok<BookingAdminDetails>, NotFound, BadRequest>> GetOneOwner(
        [FromServices] IQueryHandler<OneBookingAdminQuery, BookingAdminDetails> queryService,
        Guid id,
        CancellationToken cancellationToken)
    {
        if (id == Guid.Empty)
        {
            return TypedResults.BadRequest();
        }

        return await queryService.ExecuteAsync(new OneBookingAdminQuery(id), cancellationToken) switch
        {
            { } result => TypedResults.Ok(result),
            _ => TypedResults.NotFound()
        };
    }

    [HttpPost]
    [AuthorizeRoles(Core.Users.Role.Client)]
    public async Task<Results<Ok<Guid>, BadRequest>> Create(
        [FromServices] ICommandHandler<CreateBookingCommand, Guid?> commandHandler,
        [FromBody] CreateBookingCommand command,
        CancellationToken cancellationToken)
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
    [AuthorizeRoles(Core.Users.Role.Client)]
    public async Task<Results<Ok<Guid>, BadRequest>> Update(
        [FromServices] ICommandHandler<UpdateBookingCommand, Guid?> commandHandler,
        [FromBody] UpdateBookingCommand command,
        CancellationToken cancellationToken)
    {
        return await commandHandler.ExecuteAsync(command, cancellationToken) switch
        {
            { } id => TypedResults.Ok(id),
            _ => TypedResults.BadRequest()
        };
    }

    [HttpDelete("{id}")]
    [AuthorizeRoles(Core.Users.Role.Client)]
    public async Task<Results<Ok, NotFound>> Delete(
        [FromServices] ICommandHandler<DeleteBookingCommand, bool> commandHandler,
        Guid id,
        Guid userId,
        CancellationToken cancellationToken)
    {
        bool result = await commandHandler.ExecuteAsync(new DeleteBookingCommand(id, userId), cancellationToken);

        return result switch
        {
            true => TypedResults.Ok(),
            false => TypedResults.NotFound()
        };
    }
}