using HotelManagement.Core.Abstractions;

namespace HotelManagement.Core.Bookings;

public record UpdateBookingCommand(
    Guid Id,
    string SpecialMentions,
    string ExpectedArrival 
) : ICommand<Guid?>;

internal class UpdateBookingCommandHandler(
    IUnitOfWork unitOfWork
) : ICommandHandler<UpdateBookingCommand, Guid?>
{
    public async Task<Guid?> ExecuteAsync(UpdateBookingCommand command, CancellationToken cancellationToken)
    {
        var bookings = unitOfWork.GetRepository<Booking>();

        if (bookings.TryGetById([command.Id], out var booking))
        {
            booking.Update(
                command.SpecialMentions,
                command.ExpectedArrival
            );

            await unitOfWork.SaveChangesAsync(cancellationToken);

            return booking.Id;
        }

        return null;
    }
}