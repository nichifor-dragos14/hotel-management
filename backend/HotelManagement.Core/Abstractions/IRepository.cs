namespace HotelManagement.Core.Abstractions;

public interface IRepository<T>
{
    void Add(T entity);

    void Remove(T entityToDelete);

    bool TryGetById(object[] id, out T entity);
}