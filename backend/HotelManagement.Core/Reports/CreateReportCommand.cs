using HotelManagement.Core.Abstractions;
using HotelManagement.Core.Bookings;
using HotelManagement.Core.Properties;
using HotelManagement.Core.Users;

namespace HotelManagement.Core.Reports;

public record CreateReportCommand(
    Guid PropertyId,
    Guid UserId,
    Guid BookingId,
    string Title,
    string Description
) : ICommand<Guid?>;

internal class CreateReportCommandHandler(
    IUnitOfWork unitOfWork
) : ICommandHandler<CreateReportCommand, Guid?>
{
    public async Task<Guid?> ExecuteAsync(
        CreateReportCommand command,
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

        var reports = unitOfWork.GetRepository<Report>();

        var review = Report.Create(
            property,
            user,
            booking,
            command.Title,
            command.Description
        );

        reports.Add(review);

        await unitOfWork.SaveChangesAsync(cancellationToken);

        return review.Id;
    }
}