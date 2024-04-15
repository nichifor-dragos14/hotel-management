using HotelManagement.Core.Abstractions;

namespace HotelManagement.Core.Bookings;

public record DeleteBookingCommand(Guid Id) : ICommand<bool>;

internal class DeleteBookingCommandHandler(IUnitOfWork unitOfWork) : ICommandHandler<DeleteBookingCommand, bool>
{
    public async Task<bool> ExecuteAsync(DeleteBookingCommand command, CancellationToken cancellationToken)
    {
        var bookings = unitOfWork.GetRepository<Booking>();

        if (bookings.TryGetById([command.Id], out var booking))
        {
            bookings.Remove(booking);

            await unitOfWork.SaveChangesAsync(cancellationToken);

            return true;
        }

        return false;
    }
}