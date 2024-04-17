using HotelManagement.Core.Abstractions;

namespace HotelManagement.Core.Reviews;

public record ReviewDetails(
    Guid Id,
    string Title,
    string Description,
    double Rating
);

public record OneReviewQuery(Guid? Id) : IQuery<ReviewDetails>;

internal class OneReviewQueryHandler(
    IQueryFacade facade
) : IQueryHandler<OneReviewQuery, ReviewDetails>
{
    public async Task<ReviewDetails> ExecuteAsync(
        OneReviewQuery query,
        CancellationToken cancellationToken
    )
    {
        return
            (from review in facade.Of<Review>()
             where review.Id == query.Id
             select new ReviewDetails(
                 review.Id,
                 review.Title,
                 review.Description,
                 review.Rating
             )
            ).FirstOrDefault();
    }
}
