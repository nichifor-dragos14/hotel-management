using HotelManagement.Core.Abstractions;
using HotelManagement.Core.Reviews;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace HotelManagement.WebApi.Controllers;

[Route("reviews")]
[ApiController]
public class ReviewController : ControllerBase
{
    [HttpGet]
    public async Task<Results<Ok<IPaginatedResult<ReviewSummary>>, NotFound>> GetAll(
       [FromServices] IQueryHandler<AllReviewSummariesQuery, IPaginatedResult<ReviewSummary>> queryService,
       int from,
       int to,
       Guid userId,
       CancellationToken cancelationToken
    )
    {
        return TypedResults.Ok(await queryService.ExecuteAsync(new AllReviewSummariesQuery(from, to, userId), cancelationToken));
    }

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
