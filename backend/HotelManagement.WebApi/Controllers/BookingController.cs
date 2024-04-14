using HotelManagement.Core.Abstractions;
using HotelManagement.Core.Bookings;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace HotelManagement.WebApi.Controllers;

[Route("bookings")]
[ApiController]
public class BookingController : ControllerBase
{
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