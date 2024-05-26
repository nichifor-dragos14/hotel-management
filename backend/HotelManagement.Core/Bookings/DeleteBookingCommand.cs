using HotelManagement.Core.Abstractions;
using HotelManagement.Core.Users;

namespace HotelManagement.Core.Bookings;

public record DeleteBookingCommand(
    Guid Id,
    Guid UserId
) : ICommand<bool>;

internal class DeleteBookingCommandHandler(
    IUnitOfWork unitOfWork,
    IQueryFacade facade
) : ICommandHandler<DeleteBookingCommand, bool>
{
    public async Task<bool> ExecuteAsync(
        DeleteBookingCommand command,
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
            return false;
        }

        var bookingPart = bookingDetails.Booking;
        var userPart = bookingDetails.User;

        unitOfWork.GetRepository<User>().TryGetById([command.UserId], out var loggedUser);

        if (userPart.Id != loggedUser.Id)
        {
            return false;
        }

        var bookings = unitOfWork.GetRepository<Booking>();
    
        var xpToRemove = (int) bookingPart.TotalPrice / 100;

        while (xpToRemove != 0)
        {
            userPart.GeniusXp -= xpToRemove;

            if (userPart.GeniusXp < 0)
            {
                xpToRemove = -1 * userPart.GeniusXp;
                userPart.GeniusXp = 100;    
                        
                if (userPart.GeniusLevel == GeniusLevel.Level3)
                {
                    userPart.GeniusLevel = GeniusLevel.Level2;
                }
                else
                {
                    userPart.GeniusLevel = GeniusLevel.Level1;
                }
                if (userPart.GeniusLevel == GeniusLevel.Level1 && userPart.GeniusXp == 0)
                {
                    break;
                }
            }
            else
            {
                xpToRemove = 0;
            }
        }
       
        bookings.Remove(bookingPart);

        await unitOfWork.SaveChangesAsync(cancellationToken);

        return true;
    }
}