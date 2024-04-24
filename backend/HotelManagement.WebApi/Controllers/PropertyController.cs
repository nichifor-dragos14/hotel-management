using HotelManagement.Core.Abstractions;
using HotelManagement.Core.FileStorageService;
using HotelManagement.Core.Properties;
using HotelManagement.Core.Properties.Filters;
using HotelManagement.WebApi.DTOs;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace HotelManagement.WebApi.Controllers;

[Route("properties")]
[ApiController]
public class PropertyController(IFileStorageService _storageService) : ControllerBase
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

    [HttpGet("recommendations")]
    public async Task<Results<Ok<IPaginatedResult<PropertySummaryRecommendation>>, NotFound>> GetAllFiltered(
    [FromServices] IQueryHandler<AllPropertyRecommendationSummariesQuery, IPaginatedResult<PropertySummaryRecommendation>> queryService,
    int from,
    int to,
    [FromQuery] List<SearchHistoryFields> searchHistoryFields,
    CancellationToken cancelationToken)
    {
        return TypedResults.Ok(await queryService.ExecuteAsync(new AllPropertyRecommendationSummariesQuery(from, to, searchHistoryFields), cancelationToken));
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
    public async Task<Results<Ok<IPaginatedResult<PropertyRoom>>, NotFound>> GetAllRooms(
        [FromServices] IQueryHandler<AllPropertyRoomsQuery, IPaginatedResult<PropertyRoom>> queryService,
        Guid id,
        int from,
        int to,
        DateTime startDate,
        DateTime endDate,
        CancellationToken cancelationToken)
    {
        return TypedResults.Ok(await queryService.ExecuteAsync(new AllPropertyRoomsQuery(from, to, id, startDate, endDate), cancelationToken));
    }

    [HttpGet("{id}")]
    public async Task<Results<Ok<PropertyDetails>, NotFound, BadRequest>> GetOne(
        Guid id,
        DateTime startDate,
        DateTime endDate,
        [FromServices] IQueryHandler<OnePropertyQuery, PropertyDetails> queryService,
        CancellationToken cancellationToken)
    {
        if (id == Guid.Empty)
            return TypedResults.BadRequest();


        return await queryService.ExecuteAsync(new OnePropertyQuery(id, startDate, endDate), cancellationToken) switch
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

    [DisableRequestSizeLimit]
    [HttpPatch("upload-pictures")]
    public async Task<Results<Ok<string>, BadRequest<string>>> UploadFile(
    [FromForm] AddPropertyPicturesDTO addPropertyPicturesDTO
)
    {
        if (addPropertyPicturesDTO.Files == null || addPropertyPicturesDTO.Files.Count == 0)
        {
            return TypedResults.BadRequest("No profile picture was uploaded");
        }

        var finalImageUrl = "";

        foreach (var file in addPropertyPicturesDTO.Files)
        {
            var imageUrl = (await _storageService.UploadImage(file.OpenReadStream())).Url;

            if (imageUrl == null)
            {
                return TypedResults.BadRequest("One of the pictures did not upload correctly");
            }

            if (finalImageUrl == "")
            {
                finalImageUrl += imageUrl;
            }
            else
            {
                finalImageUrl += ";" + imageUrl;
            }
        }


        if (finalImageUrl == null)
        {
            return TypedResults.BadRequest("Something went wrong");
        }


        return TypedResults.Ok(finalImageUrl);
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