using HotelManagement.Core.Abstractions;

namespace HotelManagement.Core.Users;

public record ActivateAccountCommand(
      Guid Id
) : ICommand<Guid?>;

internal class ActivateAccountCommandHandler(
    IUnitOfWork unitOfWork
) : ICommandHandler<ActivateAccountCommand, Guid?>
{
    public async Task<Guid?> ExecuteAsync(
        ActivateAccountCommand command, 
        CancellationToken cancellationToken)
    {
        var users = unitOfWork.GetRepository<User>();

        if (users.TryGetById([command.Id], out var user))
        {
            if (user.IsConfirmed == true)
            {
                return null;
            }

            user.ConfirmAccount();

            await unitOfWork.SaveChangesAsync(cancellationToken);

            return user.Id;
        }

        return null;
    }
}