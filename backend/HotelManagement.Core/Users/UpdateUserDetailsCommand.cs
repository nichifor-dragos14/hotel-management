using HotelManagement.Core.Abstractions;

namespace HotelManagement.Core.Users;

public record UpdateUserDetailsCommand(
    Guid Id,
    string FirstName,
    string LastName,
    string PhoneNumber,
    string Nationality,
    Gender Gender,
    string Address,
    DateTime DateOfBirth
) : ICommand<Guid?>;

internal class UpdateUserDetailsCommandHandler(
    IUnitOfWork unitOfWork
) : ICommandHandler<UpdateUserDetailsCommand, Guid?>
{
    public async Task<Guid?> ExecuteAsync(UpdateUserDetailsCommand command, CancellationToken cancellationToken)
    {
        var users = unitOfWork.GetRepository<User>();

        if (users.TryGetById([command.Id], out var user))
        {
            user.UpdateDetails(
                command.FirstName,
                command.LastName,
                command.PhoneNumber,
                command.Nationality,
                command.Gender,
                command.Address,
                command.DateOfBirth
            );

            await unitOfWork.SaveChangesAsync(cancellationToken);

            return user.Id;
        }

        return null;
    }
}