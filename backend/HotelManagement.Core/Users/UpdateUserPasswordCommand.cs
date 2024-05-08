using HotelManagement.Core.Abstractions;

namespace HotelManagement.Core.Users;

public record UpdateUserPasswordCommand(
   Guid Id,
   string Password
) : ICommand<Guid?>;

internal class UpdateUserPasswordCommandHandler(
    IUnitOfWork unitOfWork
) : ICommandHandler<UpdateUserPasswordCommand, Guid?>
{
    public async Task<Guid?> ExecuteAsync(
        UpdateUserPasswordCommand command,
        CancellationToken cancellationToken)
    {
        var users = unitOfWork.GetRepository<User>();

        if (users.TryGetById([command.Id], out var user))
        {
            user.UpdatePassword(
                command.Password        
            );

            await unitOfWork.SaveChangesAsync(cancellationToken);

            return user.Id;
        }

        return null;
    }
}