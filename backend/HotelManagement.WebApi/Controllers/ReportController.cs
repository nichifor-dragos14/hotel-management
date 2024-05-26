using HotelManagement.Core.Abstractions;
using HotelManagement.Core.Reports;
using HotelManagement.WebApi.Authorize;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace HotelManagement.WebApi.Controllers;

[Route("reports")]
[ApiController]
public class ReportController
{
    [HttpGet]
    [AuthorizeRoles(Core.Users.Role.Admin)]
    public async Task<Results<Ok<IPaginatedResult<ReportSummary>>, NotFound>> GetAll(
        [FromServices] IQueryHandler<AllReportSummariesQuery, IPaginatedResult<ReportSummary>> queryService,
        int from,
        int to,
        CancellationToken cancelationToken)
    {
        return TypedResults.Ok(await queryService.ExecuteAsync(new AllReportSummariesQuery(from, to), cancelationToken));
    }

    [HttpGet("{id}")]
    [AuthorizeRoles(Core.Users.Role.Admin)]
    public async Task<Results<Ok<ReportDetails>, NotFound, BadRequest>> GetOne(
        [FromServices] IQueryHandler<OneReportQuery, ReportDetails> queryService,
        Guid id,
        CancellationToken cancellationToken)
    {
        if (id == Guid.Empty)
            return TypedResults.BadRequest();


        return await queryService.ExecuteAsync(new OneReportQuery(id), cancellationToken) switch
        {
            { } result => TypedResults.Ok(result),
            _ => TypedResults.NotFound()
        };
    }

    [HttpPost]
    [AuthorizeRoles(Core.Users.Role.Client)]
    public async Task<Results<Ok<Guid>, BadRequest>> Create(
        [FromServices] ICommandHandler<CreateReportCommand, Guid?> commandHandler,
        [FromBody] CreateReportCommand command,
        CancellationToken cancellationToken
    )
    {
        return await commandHandler.ExecuteAsync(command, cancellationToken) switch
        {
            { } id => TypedResults.Ok(id),
            _ => TypedResults.BadRequest()
        };
    }

    [HttpPatch("close")]
    [AuthorizeRoles(Core.Users.Role.Admin)]
    public async Task<Results<Ok<Guid>, BadRequest>> Close(
        [FromServices] ICommandHandler<CloseReportCommand, Guid?> commandHandler,
        [FromBody] CloseReportCommand closeReportCommand,
        CancellationToken cancellationToken)
    {
        return await commandHandler.ExecuteAsync(closeReportCommand, cancellationToken) switch
        {
            { } id => TypedResults.Ok(id),
            _ => TypedResults.BadRequest()
        };
    }

    [HttpPatch("open")]
    [AuthorizeRoles(Core.Users.Role.Admin)]
    public async Task<Results<Ok<Guid>, BadRequest>> Open(
        [FromServices] ICommandHandler<OpenReportCommand, Guid?> commandHandler,
        [FromBody] OpenReportCommand openReportCommand,
        CancellationToken cancellationToken)
    {
        return await commandHandler.ExecuteAsync(openReportCommand, cancellationToken) switch
        {
            { } id => TypedResults.Ok(id),
            _ => TypedResults.BadRequest()
        };
    }

    [HttpPatch("read")]
    [AuthorizeRoles(Core.Users.Role.Admin)]
    public async Task<Results<Ok<Guid>, BadRequest>> Read(
        [FromServices] ICommandHandler<ReadReportCommand, Guid?> commandHandler,
        [FromBody] ReadReportCommand readReportCommand,
        CancellationToken cancellationToken)
    {
        return await commandHandler.ExecuteAsync(readReportCommand, cancellationToken) switch
        {
            { } id => TypedResults.Ok(id),
            _ => TypedResults.BadRequest()
        };
    }
}
