using HotelManagement.Core.Abstractions;

namespace HotelManagement.Core.Reviews;

public record DeleteReviewCommand(Guid Id) : ICommand<bool>;

internal class DeleteReviewCommandHandler(IUnitOfWork unitOfWork) : ICommandHandler<DeleteReviewCommand, bool>
{
    public async Task<bool> ExecuteAsync(DeleteReviewCommand command, CancellationToken cancellationToken)
    {
        var reviews = unitOfWork.GetRepository<Review>();

        if (reviews.TryGetById([command.Id], out var review))
        {
            reviews.Remove(review);

            await unitOfWork.SaveChangesAsync(cancellationToken);

            return true;
        }

        return false;
    }
}