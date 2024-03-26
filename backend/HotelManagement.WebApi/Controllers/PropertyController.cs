using HotelManagement.Core.Abstractions;
using HotelManagement.Core.Properties;
using HotelManagement.Core.Properties.Filters;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace HotelManagement.WebApi.Controllers;

[Route("properties")]
[ApiController]
public class PropertyController : ControllerBase
{
    [HttpGet]
    public async Task<Results<Ok<IPaginatedResult<PropertySummary>>, NotFound>> GetAll(
        [FromServices] IQueryHandler<AllPropertySummariesQuery, IPaginatedResult<PropertySummary>> queryService,
        int from,
        int to,
        CancellationToken cancelationToken)
    {
        return TypedResults.Ok(await queryService.ExecuteAsync(new AllPropertySummariesQuery(from, to), cancelationToken));
    }

    [HttpGet("filter/{location}/{startDate}/{endDate}/{numberOfAdults}/{numberOfChildren}/{numberOfRooms}")]
    public async Task<Results<Ok<IPaginatedResult<PropertySummaryFiltered>>, NotFound>> GetAllFiltered(
       [FromServices] IQueryHandler<AllPropertySummariesFilteredQuery, IPaginatedResult<PropertySummaryFiltered>> queryService,
       int from,
       int to,
       string location,
       DateTime startDate,
       DateTime endDate,
       int numberOfAdults,
       int numberOfChildren,
       int numberOfRooms,
       [FromQuery] PropertyFiltersOptional propertyFiltersOptional,
       CancellationToken cancelationToken)
    {
        PropertyFiltersMandatory propertyFiltersMandatory = new(location, startDate, endDate, numberOfAdults, numberOfChildren, numberOfRooms);

        return TypedResults.Ok(await queryService.ExecuteAsync(new AllPropertySummariesFilteredQuery(from, to, propertyFiltersMandatory, propertyFiltersOptional), cancelationToken));
    }

    [HttpGet("types")]
    public async Task<Results<Ok<IEnumerable<PropertyTypeSummary>>, NotFound>> GetAllTypes(
        [FromServices] IQueryHandler<AllPropertyTypesQuery, IEnumerable<PropertyTypeSummary>> queryService,
        CancellationToken cancelationToken)
    {
        return TypedResults.Ok(await queryService.ExecuteAsync(new AllPropertyTypesQuery(), cancelationToken));
    }

    [HttpGet("{id}/reviews")]
    public async Task<Results<Ok<IPaginatedResult<PropertyReview>>, NotFound>> GetAllReviews(
        [FromServices] IQueryHandler<AllPropertyReviewsQuery, IPaginatedResult<PropertyReview>> queryService,
        Guid id,
        int from,
        int to,
        CancellationToken cancelationToken)
    {
        return TypedResults.Ok(await queryService.ExecuteAsync(new AllPropertyReviewsQuery(from, to, id), cancelationToken));
    }

    [HttpGet("{id}/rooms")]
    public async Task<Results<Ok<IEnumerable<PropertyRooms>>, NotFound>> GetAllRooms(Guid id,
        [FromServices] IQueryHandler<AllPropertyRoomsQuery, IEnumerable<PropertyRooms>> queryService,
        CancellationToken cancelationToken)
    {
        return TypedResults.Ok(await queryService.ExecuteAsync(new AllPropertyRoomsQuery(id), cancelationToken));
    }

    [HttpGet("{id}")]
    public async Task<Results<Ok<PropertyDetails>, NotFound, BadRequest>> GetOne(Guid id,
        [FromServices] IQueryHandler<OnePropertyQuery, PropertyDetails> queryService,
        CancellationToken cancellationToken)
    {
        if (id == Guid.Empty)
            return TypedResults.BadRequest();


        return await queryService.ExecuteAsync(new OnePropertyQuery(id), cancellationToken) switch
        {
            { } hotel => TypedResults.Ok(hotel),
            _ => TypedResults.NotFound()
        };
    }

    [HttpPost]
    public async Task<Results<Ok<Guid>, BadRequest>> Create(
        [FromBody] CreatePropertyCommand createHotelCommand,
        [FromServices] ICommandHandler<CreatePropertyCommand, Guid?> commandHandler,
        CancellationToken cancellationToken
    )
    {
        return await commandHandler.ExecuteAsync(createHotelCommand, cancellationToken) switch
        {
            { } id => TypedResults.Ok(id),
            _ => TypedResults.BadRequest()
        };
    }

    [HttpPatch]
    public async Task<Results<Ok<Guid>, BadRequest>> Update(
        [FromBody] UpdatePropertyCommand updateHotelCommand,
        [FromServices] ICommandHandler<UpdatePropertyCommand, Guid?> commandHandler,
        CancellationToken cancellationToken
    )
    {
        return await commandHandler.ExecuteAsync(updateHotelCommand, cancellationToken) switch
        {
            { } id => TypedResults.Ok(id),
            _ => TypedResults.BadRequest()
        };
    }

    [HttpDelete("{id}")]
    public async Task<Results<Ok, NotFound>> Delete(Guid id,
        [FromServices] ICommandHandler<DeletePropertyCommand, bool> commandHandler,
        CancellationToken cancellationToken)
    {
        bool result = await commandHandler.ExecuteAsync(new DeletePropertyCommand(id), cancellationToken);

        return result switch
        {
            true => TypedResults.Ok(),
            false => TypedResults.NotFound()
        };
    }
}