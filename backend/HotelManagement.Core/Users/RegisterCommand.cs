using HotelManagement.Core.Abstractions;
using HotelManagement.Core.Utils;

namespace HotelManagement.Core.Users;

public record RegisterCommand(
      string FirstName,
      string LastName,
      string Email,
      string PhoneNumber,
      string Nationality,
      Gender Gender,
      string Address,
      DateTime DateOfBirth,
      string Password,
      string? ProfilePicture,
      string? ActivationToken
) : ICommand<Guid?>;

internal class RegisterCommandHandler(
    IUnitOfWork unitOfWork
) : ICommandHandler<RegisterCommand, Guid?>
{
    public async Task<Guid?> ExecuteAsync(
        RegisterCommand command,
        CancellationToken cancellationToken)
    {
        var users = unitOfWork.GetRepository<User>();

        string encryptedPassword = PasswordUtility.EncryptPassword(command.Password);

        var user = User.Create(
                 command.FirstName,
                 command.LastName,
                 command.Email,
                 command.PhoneNumber,
                 command.Nationality,
                 command.Gender,
                 command.Address,
                 command.DateOfBirth,
                 encryptedPassword,
                 command.ProfilePicture,
                 command.ActivationToken
        );

        users.Add(user);

        await unitOfWork.SaveChangesAsync(cancellationToken);

        return user.Id;
    }
}