using HotelManagement.Core.Abstractions;
using HotelManagement.Core.Reviews;
using HotelManagement.WebApi.Authorize;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace HotelManagement.WebApi.Controllers;

[Route("reviews")]
[ApiController]
public class ReviewController : ControllerBase
{
    [HttpGet]
    [AuthorizeRoles(Core.Users.Role.Client)]
    public async Task<Results<Ok<IPaginatedResult<ReviewSummary>>, NotFound>> GetAll(
        [FromServices] IQueryHandler<AllReviewSummariesQuery, IPaginatedResult<ReviewSummary>> queryService,
        int from,
        int to,
        Guid userId,
        CancellationToken cancelationToken)
    {
        return TypedResults.Ok(await queryService.ExecuteAsync(new AllReviewSummariesQuery(from, to, userId), cancelationToken));
    }

    [HttpGet("{id}")]
    [AuthorizeRoles(Core.Users.Role.Client, Core.Users.Role.Owner)]
    public async Task<Results<Ok<ReviewDetails>, NotFound, BadRequest>> GetOne(
        [FromServices] IQueryHandler<OneReviewQuery, ReviewDetails> queryService,
        Guid id,
        CancellationToken cancellationToken)
    {
        if (id == Guid.Empty)
        {
            return TypedResults.BadRequest();
        }

        return await queryService.ExecuteAsync(new OneReviewQuery(id), cancellationToken) switch
        {
            { } report => TypedResults.Ok(report),
            _ => TypedResults.NotFound()
        };
    }

    [HttpPost]
    [AuthorizeRoles(Core.Users.Role.Client)]
    public async Task<Results<Ok<Guid>, BadRequest>> Create(
        [FromServices] ICommandHandler<CreateReviewCommand, Guid?> commandHandler,
        [FromBody] CreateReviewCommand command,
        CancellationToken cancellationToken)
    {
        return await commandHandler.ExecuteAsync(command, cancellationToken) switch
        {
            { } id => TypedResults.Ok(id),
            _ => TypedResults.BadRequest()
        };
    }

    [HttpPatch]
    [AuthorizeRoles(Core.Users.Role.Client)]
    public async Task<Results<Ok<Guid>, BadRequest>> Update(
        [FromServices] ICommandHandler<UpdateReviewCommand, Guid?> commandHandler,
        [FromBody] UpdateReviewCommand command,
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
        [FromServices] ICommandHandler<DeleteReviewCommand, bool> commandHandler,
        Guid id,
        Guid userId,
        CancellationToken cancellationToken)
    {
        bool result = await commandHandler.ExecuteAsync(new DeleteReviewCommand(id, userId), cancellationToken);

        return result switch
        {
            true => TypedResults.Ok(),
            false => TypedResults.NotFound()
        };
    }
}
