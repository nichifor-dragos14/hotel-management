using HotelManagement.Core.Abstractions;
using HotelManagement.Core.Users;

namespace HotelManagement.Core.Bookings;

public record DeleteBookingCommand(Guid Id) : ICommand<bool>;

internal class DeleteBookingCommandHandler(IUnitOfWork unitOfWork) : ICommandHandler<DeleteBookingCommand, bool>
{
    public async Task<bool> ExecuteAsync(DeleteBookingCommand command, CancellationToken cancellationToken)
    {
        var bookings = unitOfWork.GetRepository<Booking>();
        var users = unitOfWork.GetRepository<User>();

        if (bookings.TryGetById([command.Id], out var booking))
        {
            if (users.TryGetById([booking.UserId], out var user))
            {
                var xpToRemove = (int) booking.TotalPrice / 100;

                while (xpToRemove != 0)
                {
                    user.GeniusXp -= xpToRemove;

                    if (user.GeniusXp < 0)
                    {
                        xpToRemove = -1 * user.GeniusXp;
                        user.GeniusXp = 100;    
                        
                        if (user.GeniusLevel == GeniusLevel.Level3)
                        {
                            user.GeniusLevel = GeniusLevel.Level2;
                        }
                        else
                        {
                            user.GeniusLevel = GeniusLevel.Level1;
                        }
                        if (user.GeniusLevel == GeniusLevel.Level1 && user.GeniusXp == 0)
                        {
                            break;
                        }
                    }
                    else
                    {
                        xpToRemove = 0;
                    }
                }
       
                bookings.Remove(booking);

                await unitOfWork.SaveChangesAsync(cancellationToken);

                return true;
            }
        }

        return false;
    }
}