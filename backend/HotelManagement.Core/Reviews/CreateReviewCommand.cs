using HotelManagement.Core.Abstractions;
using HotelManagement.Core.Bookings;
using HotelManagement.Core.Properties;
using HotelManagement.Core.Users;

namespace HotelManagement.Core.Reviews;

public record CreateReviewCommand(
    Guid PropertyId, 
    Guid BookingId,
    Guid UserId,
    string Title,
    double Rating,
    string Description
) : ICommand<Guid?>;

internal class CreateReviewCommandHandler(
    IUnitOfWork unitOfWork
) : ICommandHandler<CreateReviewCommand, Guid?>
{
    public async Task<Guid?> ExecuteAsync(
        CreateReviewCommand command,
        CancellationToken cancellationToken)
    {
        var properties = unitOfWork.GetRepository<Property>();

        properties.TryGetById([command.PropertyId], out var property);

        if (property == null)
        {
            return null;
        }

        var bookings = unitOfWork.GetRepository<Booking>();

        bookings.TryGetById([command.BookingId], out var booking);

        if (booking == null)
        {
            return null;
        }

        var users = unitOfWork.GetRepository<User>();

        users.TryGetById([command.UserId], out var user);

        if (user == null)
        {
            return null;
        }

        var reviews = unitOfWork.GetRepository<Review>();

        var review = Review.Create(
            booking,
            property,
            user,
            command.Title,
            command.Rating,
            command.Description
        );

        reviews.Add(review);

        await unitOfWork.SaveChangesAsync(cancellationToken);
       
        return review.Id;
    }
}