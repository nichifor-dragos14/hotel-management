using HotelManagement.Core.Abstractions;

namespace HotelManagement.Core.Reviews;

public record UpdateReviewCommand(
    Guid Id,
    string Title,
    string Description,
    double Rating
) : ICommand<Guid?>;

internal class UpdateReviewCommandHandler(
    IUnitOfWork unitOfWork
) : ICommandHandler<UpdateReviewCommand, Guid?>
{
    public async Task<Guid?> ExecuteAsync(
        UpdateReviewCommand command,
        CancellationToken cancellationToken)
    {
        var reviews = unitOfWork.GetRepository<Review>();

        if (reviews.TryGetById([command.Id], out var review))
        {
            review.Update(
                command.Title,
                command.Description,
                command.Rating
            );

            await unitOfWork.SaveChangesAsync(cancellationToken);

            return review.Id;
        }

        return review.Id;
    }
}