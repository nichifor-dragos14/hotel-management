using HotelManagement.Core.Abstractions;
using HotelManagement.Core.Reviews;
using HotelManagement.WebApi.Authorize;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace HotelManagement.WebApi.Controllers;

[Route("reviews")]
[ApiController]
[AuthorizeRoles(Core.Users.Role.Client)]
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

    [HttpGet("{id}")]
    public async Task<Results<Ok<ReviewDetails>, NotFound, BadRequest>> GetOne(Guid id,
      [FromServices] IQueryHandler<OneReviewQuery, ReviewDetails> queryService,
      CancellationToken cancellationToken)
    {
        if (id == Guid.Empty)
            return TypedResults.BadRequest();


        return await queryService.ExecuteAsync(new OneReviewQuery(id), cancellationToken) switch
        {
            { } report => TypedResults.Ok(report),
            _ => TypedResults.NotFound()
        };
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

    [HttpPatch]
    public async Task<Results<Ok<Guid>, BadRequest>> Update(
       [FromBody] UpdateReviewCommand command,
       [FromServices] ICommandHandler<UpdateReviewCommand, Guid?> commandHandler,
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
