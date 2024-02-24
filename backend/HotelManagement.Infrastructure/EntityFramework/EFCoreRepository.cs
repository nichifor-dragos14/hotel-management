using HotelManagement.Core.Abstractions;
using Microsoft.EntityFrameworkCore;

namespace HotelManagement.Infrastructure.EntityFramework;

internal class EFCoreRepository<T>(DbSet<T> dbSet) : IRepository<T> where T : class
{
    public void Add(T entity)
    {
        dbSet.Add(entity);
    }

    public void Remove(T entity)
    {
        dbSet.Remove(entity);
    }

    public bool TryGetById(object[] id, out T entity)
    {
        return (entity = dbSet.Find(id)!) is not null;
    }
}