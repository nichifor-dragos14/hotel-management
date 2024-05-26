using HotelManagement.Core.Abstractions;
using HotelManagement.Core.Users;

namespace HotelManagement.Core.Reviews;

public record UpdateReviewCommand(
    Guid Id,
    string Title,
    string Description,
    double Rating,
    Guid UserId
) : ICommand<Guid?>;

internal class UpdateReviewCommandHandler(
    IUnitOfWork unitOfWork,
    IQueryFacade facade
) : ICommandHandler<UpdateReviewCommand, Guid?>
{
    public async Task<Guid?> ExecuteAsync(
        UpdateReviewCommand command,
        CancellationToken cancellationToken)
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
            return null;
        }

        var reviewPart = reviewDetails.Review;
        var userPart = reviewDetails.User;

        unitOfWork.GetRepository<User>().TryGetById([command.UserId], out var loggedUser);

        if (userPart.Id != loggedUser.Id)
        {
            return null;
        }

        reviewPart.Update(
            command.Title,
            command.Description,
            command.Rating
        );

        await unitOfWork.SaveChangesAsync(cancellationToken);

        return reviewPart.Id;
    }
}