using HotelManagement.Core.Abstractions;
using HotelManagement.Core.Users;

namespace HotelManagement.Core.Reviews;

public record ReviewDetails(
    Guid Id,
    string Title,
    string Description,
    double Rating,
    string UserFirstName,
    string UserLastName,
    string UserProfilePicture
);

public record OneReviewQuery(
    Guid? Id
) : IQuery<ReviewDetails>;

internal class OneReviewQueryHandler(
    IQueryFacade facade
) : IQueryHandler<OneReviewQuery, ReviewDetails>
{
    public async Task<ReviewDetails> ExecuteAsync(
        OneReviewQuery query,
        CancellationToken cancellationToken
    )
    {
        var reviewDetails = (from review in facade.Of<Review>()
                             where review.Id == query.Id
                             join user in facade.Of<User>() on review.UserId equals user.Id
                             select new ReviewDetails(
                                 review.Id,
                                 review.Title,
                                 review.Description,
                                 review.Rating,
                                 user.FirstName,
                                 user.LastName,
                                 user.ProfilePicture
                             )).FirstOrDefault();

        return reviewDetails;
    }
}
