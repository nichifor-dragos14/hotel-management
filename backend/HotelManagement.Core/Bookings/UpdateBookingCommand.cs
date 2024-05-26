using HotelManagement.Core.Abstractions;
using HotelManagement.Core.Users;

namespace HotelManagement.Core.Bookings;

public record UpdateBookingCommand(
    Guid Id,
    string SpecialMentions,
    string ExpectedArrival,
    Guid UserId
) : ICommand<Guid?>;

internal class UpdateBookingCommandHandler(
    IUnitOfWork unitOfWork,
    IQueryFacade facade
) : ICommandHandler<UpdateBookingCommand, Guid?>
{
    public async Task<Guid?> ExecuteAsync(
        UpdateBookingCommand command,
        CancellationToken cancellationToken)
    {
        var bookingDetails =
          (from booking in facade.Of<Booking>()
           where booking.Id == command.Id
           join user in facade.Of<User>() on booking.UserId equals user.Id
           select new
           {
               Booking = booking,
               User = user
           }).FirstOrDefault();

        if (bookingDetails == null)
        {
            return null;
        }

        var bookingPart = bookingDetails.Booking;
        var userPart = bookingDetails.User;

        unitOfWork.GetRepository<User>().TryGetById([command.UserId], out var loggedUser);

        if (userPart.Id != loggedUser.Id)
        {
            return null;
        }

        bookingPart.Update(
            command.SpecialMentions,
            command.ExpectedArrival
        );

        await unitOfWork.SaveChangesAsync(cancellationToken);

        return bookingPart.Id;
    }
}