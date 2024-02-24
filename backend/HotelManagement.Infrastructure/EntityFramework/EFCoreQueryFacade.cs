using HotelManagement.Core.Abstractions;

namespace HotelManagement.Infrastructure.EntityFramework;

internal class EFCoreQueryFacade(ApplicationDbContext dbContext) : IQueryFacade
{
    public IQueryable<TEntity> Of<TEntity>() where TEntity : class
    {
        return dbContext.Set<TEntity>().AsQueryable();
    }
}