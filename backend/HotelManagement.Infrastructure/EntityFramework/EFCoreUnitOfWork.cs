using System.Threading;
using HotelManagement.Core.Abstractions;

namespace HotelManagement.Infrastructure.EntityFramework;

internal class EFCoreUnitOfWork(ApplicationDbContext dbContext) : IUnitOfWork
{
    private readonly Dictionary<Type, object> repositories = new();

    public IRepository<T> GetRepository<T>() where T : class
    {
        if (!repositories.ContainsKey(typeof(T)))
            repositories.Add(typeof(T), new EFCoreRepository<T>(dbContext.Set<T>()));

        return (repositories[typeof(T)] as IRepository<T>)!;
    }

    public async Task SaveChangesAsync(CancellationToken cancellationToken)
    {
        var transaction = dbContext.Database.BeginTransaction();

        try
        {
            await dbContext.SaveChangesAsync(cancellationToken);
            transaction.Commit();
        }
        catch
        {
            transaction.Rollback();

            throw;
        }
    }
}