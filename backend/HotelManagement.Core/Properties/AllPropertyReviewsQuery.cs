using HotelManagement.Core.Abstractions;

namespace HotelManagement.Core.Properties;

public record PropertyReview(
    Guid Id,
    string Title,
    string Description,
    double Rating,
    DateTime CreatedOn,
    string UserFirstName,
    string UserLastName,
    string UserNationality,
    string ProfilePicture,
    int RowNumber
);

public record AllPropertyReviewsQuery(int From, int To, Guid Id) : IQuery<IPaginatedResult<PropertyReview>>;