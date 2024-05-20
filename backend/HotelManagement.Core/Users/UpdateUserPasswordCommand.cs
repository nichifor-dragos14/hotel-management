using HotelManagement.Core.Abstractions;
using HotelManagement.Core.Utils;

namespace HotelManagement.Core.Users;

public record UpdateUserPasswordCommand(
   Guid Id,
   string OldPassword,
   string NewPassword
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
            if (PasswordUtility.DecryptPassword(user.Password) != command.OldPassword)
            {
                return null;
            }

            var newPasswordEncrypted = PasswordUtility.EncryptPassword(command.NewPassword);

            user.UpdatePassword(
                newPasswordEncrypted
            );

            await unitOfWork.SaveChangesAsync(cancellationToken);

            return user.Id;
        }

        return null;
    }
}