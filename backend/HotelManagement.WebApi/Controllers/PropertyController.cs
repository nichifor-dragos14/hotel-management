using HotelManagement.Core.Abstractions;
using HotelManagement.Core.FileStorageService;
using HotelManagement.Core.Properties;
using HotelManagement.Core.Properties.Filters;
using HotelManagement.WebApi.Authorize;
using HotelManagement.WebApi.DTOs;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace HotelManagement.WebApi.Controllers;

[Route("properties")]
[ApiController]
public class PropertyController(IFileStorageService _storageService) : ControllerBase
{
    [HttpGet]
    [AuthorizeRoles(Core.Users.Role.Admin, Core.Users.Role.Owner)]
    public async Task<Results<Ok<IPaginatedResult<PropertySummary>>, NotFound>> GetAll(
        [FromServices] IQueryHandler<AllPropertySummariesQuery, IPaginatedResult<PropertySummary>> queryService,
        int from,
        int to,
        Guid userId,
        string userRole,
        string? name,
        CancellationToken cancelationToken)
    {
        return TypedResults.Ok(await queryService.ExecuteAsync(new AllPropertySummariesQuery(from, to, userId, userRole, name != null ? name : ""), cancelationToken));
    }

    [HttpGet("filter/{location}/{startDate}/{endDate}/{numberOfAdults}/{numberOfChildren}/{numberOfRooms}")]
    public async Task<Results<Ok<IPaginatedResult<PropertySummaryFiltered>>, NotFound>> GetAllFiltered(
       [FromServices] IQueryHandler<AllPropertySummariesFilteredQuery, IPaginatedResult<PropertySummaryFiltered>> queryService,
       [FromQuery] PropertyFiltersOptional propertyFiltersOptional,
       int from,
       int to,
       string location,
       DateTime startDate,
       DateTime endDate,
       int numberOfAdults,
       int numberOfChildren,
       int numberOfRooms,
       CancellationToken cancelationToken)
    {
        PropertyFiltersMandatory propertyFiltersMandatory = new(location, startDate, endDate, numberOfAdults, numberOfChildren, numberOfRooms);

        return TypedResults.Ok(await queryService.ExecuteAsync(new AllPropertySummariesFilteredQuery(from, to, propertyFiltersMandatory, propertyFiltersOptional), cancelationToken));
    }

    [HttpGet("recommendations")]
    public async Task<Results<Ok<IPaginatedResult<PropertySummaryRecommendation>>, NotFound>> GetAllFiltered(
        [FromServices] IQueryHandler<AllPropertyRecommendationSummariesQuery, IPaginatedResult<PropertySummaryRecommendation>> queryService,
        [FromQuery] List<SearchHistoryFields> searchHistoryFields,
        int from,
        int to,
        Guid? logggedUsedId,
        CancellationToken cancelationToken)
    {
        return TypedResults.Ok(await queryService.ExecuteAsync(new AllPropertyRecommendationSummariesQuery(logggedUsedId, from, to, searchHistoryFields), cancelationToken));
    }

    [HttpGet("types")]
    [AuthorizeRoles(Core.Users.Role.Owner)]
    public async Task<Results<Ok<IEnumerable<PropertyTypeSummary>>, NotFound>> GetAllTypes(
        [FromServices] IQueryHandler<AllPropertyTypesQuery, IEnumerable<PropertyTypeSummary>> queryService,
        CancellationToken cancelationToken)
    {
        return TypedResults.Ok(await queryService.ExecuteAsync(new AllPropertyTypesQuery(), cancelationToken));
    }

    [HttpGet("{id}/bookings-past")]
    [AuthorizeRoles(Core.Users.Role.Owner)]
    public async Task<Results<Ok<IPaginatedResult<PropertyBooking>>, NotFound>> GetAllPastBookings(
       [FromServices] IQueryHandler<AllPastPropertyBookingsQuery, IPaginatedResult<PropertyBooking>> queryService,
       Guid id,
       int from,
       int to,
       CancellationToken cancelationToken)
    {
        return TypedResults.Ok(await queryService.ExecuteAsync(new AllPastPropertyBookingsQuery(from, to, id), cancelationToken));
    }

    [HttpGet("{id}/bookings-upcoming")]
    [AuthorizeRoles(Core.Users.Role.Owner)]
    public async Task<Results<Ok<IPaginatedResult<PropertyBooking>>, NotFound>> GetAllUpcomingBookings(
       [FromServices] IQueryHandler<AllUpcomingPropertyBookingsQuery, IPaginatedResult<PropertyBooking>> queryService,
       Guid id,
       int from,
       int to,
       CancellationToken cancelationToken)
    {
        return TypedResults.Ok(await queryService.ExecuteAsync(new AllUpcomingPropertyBookingsQuery(from, to, id), cancelationToken));
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
    public async Task<Results<Ok<IPaginatedResult<PropertyRoom>>, NotFound>> GetAllRooms(
        [FromServices] IQueryHandler<AllPropertyRoomsQuery, IPaginatedResult<PropertyRoom>> queryService,
        Guid id,
        int from,
        int to,
        DateTime startDate,
        DateTime endDate,
        int numberOfAdults,
        int numberOfChildren,
        Guid? loggedUserId,
        CancellationToken cancelationToken)
    {
        return TypedResults.Ok(await queryService.ExecuteAsync(new AllPropertyRoomsQuery(from, to, id, startDate, endDate, numberOfAdults, numberOfChildren, loggedUserId), cancelationToken));
    }

    [HttpGet("{id}")]
    public async Task<Results<Ok<PropertyDetails>, NotFound, BadRequest>> GetOne(
        [FromServices] IQueryHandler<OnePropertyQuery, PropertyDetails> queryService,
        Guid id,
        DateTime startDate,
        DateTime endDate,
        int numberOfAdults,
        int numberOfChildren,
        Guid? loggedUserId,
        CancellationToken cancellationToken)
    {
        if (id == Guid.Empty)
            return TypedResults.BadRequest();


        return await queryService.ExecuteAsync(new OnePropertyQuery(id, startDate, endDate, numberOfAdults, numberOfChildren, loggedUserId), cancellationToken) switch
        {
            { } result => TypedResults.Ok(result),
            _ => TypedResults.NotFound()
        };
    }

    [HttpGet("discount")]
    [AuthorizeRoles(Core.Users.Role.Client)]
    public async Task<Results<Ok<int>, NotFound, BadRequest>> GetDiscount(
        [FromServices] IQueryHandler<OnePropertyDiscountQuery, int> queryService,
        Guid propertyId,
        Guid loggedUserId,
        CancellationToken cancellationToken)
    {
        return await queryService.ExecuteAsync(new OnePropertyDiscountQuery(propertyId, loggedUserId), cancellationToken) switch
        {
            { } discount => TypedResults.Ok(discount),
        };
    }

    [HttpPost]
    [AuthorizeRoles(Core.Users.Role.Owner)]
    public async Task<Results<Ok<Guid>, BadRequest>> Create(
        [FromServices] ICommandHandler<CreatePropertyCommand, Guid?> commandHandler,
        [FromBody] CreatePropertyCommand createHotelCommand,
        CancellationToken cancellationToken)
    {
        return await commandHandler.ExecuteAsync(createHotelCommand, cancellationToken) switch
        {
            { } id => TypedResults.Ok(id),
            _ => TypedResults.BadRequest()
        };
    }

    [HttpPatch]
    [AuthorizeRoles(Core.Users.Role.Admin, Core.Users.Role.Owner)]
    public async Task<Results<Ok<Guid>, BadRequest>> Update(
        [FromServices] ICommandHandler<UpdatePropertyCommand, Guid?> commandHandler,
        [FromBody] UpdatePropertyCommand updateHotelCommand,
        CancellationToken cancellationToken)
    {
        return await commandHandler.ExecuteAsync(updateHotelCommand, cancellationToken) switch
        {
            { } id => TypedResults.Ok(id),
            _ => TypedResults.BadRequest()
        };
    }

    [HttpPatch("upload")]
    [AuthorizeRoles(Core.Users.Role.Admin, Core.Users.Role.Owner)]
    public async Task<Results<Ok<string>, BadRequest<string>>> UploadFile(
        [FromForm] AddPropertyPictureDTO addPropertyPicturesDTO)
    {
        if (addPropertyPicturesDTO.File == null )
        {
            return TypedResults.BadRequest("No picture was uploaded");
        }

        var imageUrl = (await _storageService.UploadImage(addPropertyPicturesDTO.File.OpenReadStream())).Url;

        if (imageUrl == null)
        {
            return TypedResults.BadRequest("The picture did not upload correctly");
        }

        return TypedResults.Ok(imageUrl);
    }

    [HttpDelete("{id}")]
    [AuthorizeRoles(Core.Users.Role.Admin, Core.Users.Role.Owner)]
    public async Task<Results<Ok, NotFound>> Delete(
        [FromServices] ICommandHandler<DeletePropertyCommand, bool> commandHandler,
        Guid id,
        Guid userId,
        CancellationToken cancellationToken)
    {
        bool result = await commandHandler.ExecuteAsync(new DeletePropertyCommand(id, userId), cancellationToken);

        return result switch
        {
            true => TypedResults.Ok(),
            false => TypedResults.NotFound()
        };
    }
}