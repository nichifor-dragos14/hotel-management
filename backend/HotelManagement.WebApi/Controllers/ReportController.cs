using HotelManagement.Core.Abstractions;
using HotelManagement.Core.Reports;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace HotelManagement.WebApi.Controllers;


[Route("reports")]
[ApiController]
public class ReportController
{
    [HttpGet]
    public async Task<Results<Ok<IPaginatedResult<ReportSummary>>, NotFound>> GetAll(
       [FromServices] IQueryHandler<AllReportSummariesQuery, IPaginatedResult<ReportSummary>> queryService,
       int from,
       int to,
       CancellationToken cancelationToken)
    {
        return TypedResults.Ok(await queryService.ExecuteAsync(new AllReportSummariesQuery(from, to), cancelationToken));
    }

    [HttpGet("{id}")]
    public async Task<Results<Ok<ReportDetails>, NotFound, BadRequest>> GetOne(Guid id,
        [FromServices] IQueryHandler<OneReportQuery, ReportDetails> queryService,
        CancellationToken cancellationToken)
    {
        if (id == Guid.Empty)
            return TypedResults.BadRequest();


        return await queryService.ExecuteAsync(new OneReportQuery(id), cancellationToken) switch
        {
            { } report => TypedResults.Ok(report),
            _ => TypedResults.NotFound()
        };
    }

    [HttpPatch("close")]
    public async Task<Results<Ok<Guid>, BadRequest>> Close(
        [FromBody] CloseReportCommand closeReportCommand,
        [FromServices] ICommandHandler<CloseReportCommand, Guid?> commandHandler,
        CancellationToken cancellationToken
    )
    {
        return await commandHandler.ExecuteAsync(closeReportCommand, cancellationToken) switch
        {
            { } id => TypedResults.Ok(id),
            _ => TypedResults.BadRequest()
        };
    }

    [HttpPatch("open")]
    public async Task<Results<Ok<Guid>, BadRequest>> Open(
        [FromBody] OpenReportCommand openReportCommand,
        [FromServices] ICommandHandler<OpenReportCommand, Guid?> commandHandler,
        CancellationToken cancellationToken
    )
    {
        return await commandHandler.ExecuteAsync(openReportCommand, cancellationToken) switch
        {
            { } id => TypedResults.Ok(id),
            _ => TypedResults.BadRequest()
        };
    }
}
