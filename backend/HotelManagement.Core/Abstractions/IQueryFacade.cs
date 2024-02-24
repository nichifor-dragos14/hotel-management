namespace HotelManagement.Core.Abstractions;

public interface IQueryFacade
{
    IQueryable<TEntity> Of<TEntity>() where TEntity : class;
}