using HotelManagement.Core.Abstractions;
using HotelManagement.Core.Users;

namespace HotelManagement.Core.Reviews;

public record DeleteReviewCommand(
    Guid Id,
    Guid UserId
) : ICommand<bool>;

internal class DeleteReviewCommandHandler(
    IUnitOfWork unitOfWork,
    IQueryFacade facade
) : ICommandHandler<DeleteReviewCommand, bool>
{
    public async Task<bool> ExecuteAsync(DeleteReviewCommand command, CancellationToken cancellationToken)
    {
        var reviewDetails =
            (from review in facade.Of<Review>()
             where review.Id == command.Id
             join user in facade.Of<User>() on review.UserId equals user.Id
             select new
             {
                 Review = review,
                 User = user
             }).FirstOrDefault();

        if (reviewDetails == null)
        {
            return false;
        }

        var reviewPart = reviewDetails.Review;
        var userPart = reviewDetails.User;

        unitOfWork.GetRepository<User>().TryGetById([command.UserId], out var loggedUser);

        if (userPart.Id != loggedUser.Id)
        {
            return false;
        }

        var reviews = unitOfWork.GetRepository<Review>();

        reviews.Remove(reviewPart);

        await unitOfWork.SaveChangesAsync(cancellationToken);

        return true;
    }
}