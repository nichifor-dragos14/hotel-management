using HotelManagement.Core.Abstractions;

namespace HotelManagement.Core.Users;

public record UpdateProfilePictureCommand(
    Guid Id,
    string ProfilePicture
) : ICommand<Guid?>;

internal class UpdateProfilePictureCommandHandler(
    IUnitOfWork unitOfWork
) : ICommandHandler<UpdateProfilePictureCommand, Guid?>
{
    public async Task<Guid?> ExecuteAsync(
        UpdateProfilePictureCommand command,
        CancellationToken cancellationToken)
    {
        var users = unitOfWork.GetRepository<User>();

        if (users.TryGetById([command.Id], out var user))
        {
            user.UpdateProfilePicture(
               command.ProfilePicture
            );

            await unitOfWork.SaveChangesAsync(cancellationToken);

            return user.Id;
        }

        return null;
    }
}