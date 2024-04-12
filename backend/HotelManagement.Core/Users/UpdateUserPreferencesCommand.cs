using HotelManagement.Core.Abstractions;

namespace HotelManagement.Core.Users;

public record UpdateUserPreferencesCommand(
    Guid Id,
    bool RetainSearchHistory,
    bool SendOffersOnEmail
) : ICommand<Guid?>;

internal class UpdateUserPreferencesCommandHandler(
    IUnitOfWork unitOfWork
) : ICommandHandler<UpdateUserPreferencesCommand, Guid?>
{
    public async Task<Guid?> ExecuteAsync(UpdateUserPreferencesCommand command, CancellationToken cancellationToken)
    {
        var properties = unitOfWork.GetRepository<User>();

        if (properties.TryGetById([command.Id], out var user))
        {
            user.UpdatePreferences(
                command.RetainSearchHistory,
                command.SendOffersOnEmail
            );

            await unitOfWork.SaveChangesAsync(cancellationToken);

            return user.Id;
        }

        return null;
    }
}