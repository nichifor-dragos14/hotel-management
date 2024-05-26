using HotelManagement.Core.Abstractions;
using HotelManagement.Core.Users;

namespace HotelManagement.Core.Properties;

public record DeletePropertyCommand(
    Guid Id,
    Guid UserId
) : ICommand<bool>;

internal class DeletePropertyCommandHandler(
    IUnitOfWork unitOfWork,
    IQueryFacade facade
) : ICommandHandler<DeletePropertyCommand, bool>
{
    public async Task<bool> ExecuteAsync(
        DeletePropertyCommand command,
        CancellationToken cancellationToken)
    {
        var propertyDetails =
            (from property in facade.Of<Property>()
             where property.Id == command.Id
             join user in facade.Of<User>() on property.UserId equals user.Id
             select new
             {
                 Property = property,
                 User = user
             }).FirstOrDefault();

        if (propertyDetails == null)
        {
            return false;
        }

        var propertyPart = propertyDetails.Property;
        var userPart = propertyDetails.User;

        unitOfWork.GetRepository<User>().TryGetById([command.UserId], out var loggedUser);

        if (loggedUser.Role != Role.Admin && userPart.Id != loggedUser.Id)
        {
            return false;
        }

        var properties = unitOfWork.GetRepository<Property>();

        properties.Remove(propertyPart);

        await unitOfWork.SaveChangesAsync(cancellationToken);

        return true;
    }
}