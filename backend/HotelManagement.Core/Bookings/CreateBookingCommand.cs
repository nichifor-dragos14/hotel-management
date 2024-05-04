using HotelManagement.Core.Abstractions;
using HotelManagement.Core.Rooms;
using HotelManagement.Core.Users;

namespace HotelManagement.Core.Bookings;

public record CreateBookingCommand(
    UserDetailsForBooking UserDetails,
    Guid LoggedUserId,
    Guid RoomId,
    DateTime StartDate,
    DateTime EndDate,
    int TotalPrice,
    string SpecialMentions,
    string ExpectedArrival
) : ICommand<Guid?>;

public record UserDetailsForBooking(
    string FirstName,
    string LastName,
    string Email,
    string PhoneNumber,
    string Country
);

internal class CreateBookingCommandHandler(
    IUnitOfWork unitOfWork
) : ICommandHandler<CreateBookingCommand, Guid?>
{
    public async Task<Guid?> ExecuteAsync(CreateBookingCommand command, CancellationToken cancellationToken)
    {
        var users = unitOfWork.GetRepository<User>();

        users.TryGetById([command.LoggedUserId], out var user);

        if (user == null)
        {
            return null;
        }

        var rooms = unitOfWork.GetRepository<Room>();

        rooms.TryGetById([command.RoomId], out var room);

        if (room == null)
        {
            return null;
        }

        var bookings = unitOfWork.GetRepository<Booking>();

        var newBooking = Booking.Create(
            command.StartDate,
            command.EndDate,
            command.TotalPrice,
            command.UserDetails.FirstName,
            command.UserDetails.LastName,
            command.UserDetails.Email,
            command.UserDetails.PhoneNumber,
            command.UserDetails.Country,
            command.SpecialMentions,
            command.ExpectedArrival,
            user,
            room
        );

        bookings.Add(newBooking);

        var earnedXp = newBooking.TotalPrice / 100;

        user.GeniusXp += earnedXp;

        if (user.GeniusXp >= 100)
        {
            var levelsForward = user.GeniusXp / 100;

            user.GeniusXp = user.GeniusXp % 100;

            if (levelsForward == 1)
            {
                if (user.GeniusLevel == GeniusLevel.Level1)
                {
                    user.GeniusLevel = GeniusLevel.Level2;
                }
                else if (user.GeniusLevel == GeniusLevel.Level2)
                {
                    user.GeniusLevel = GeniusLevel.Level3;
                }

            }

            if (levelsForward >= 2)
            {
                user.GeniusLevel = GeniusLevel.Level3;
            }
        }

        if (user.GeniusLevel == GeniusLevel.Level3)
        {
            user.GeniusXp = 100;
        }
     
        await unitOfWork.SaveChangesAsync(cancellationToken);

        return newBooking.Id;
    }
}