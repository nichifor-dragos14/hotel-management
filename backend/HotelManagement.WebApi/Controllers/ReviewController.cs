using HotelManagement.Core.Abstractions;
using HotelManagement.Core.Reviews;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace HotelManagement.WebApi.Controllers;

[Route("reviews")]
[ApiController]
public class ReviewController : ControllerBase
{
    [HttpPost]
    public async Task<Results<Ok<Guid>, BadRequest>> Create(
       [FromBody] CreateReviewCommand command,
       [FromServices] ICommandHandler<CreateReviewCommand, Guid?> commandHandler,
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
