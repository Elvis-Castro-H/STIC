using CatalogApi.Data.Abstract;
using CatalogApi.Data.Contexts;
using CatalogApi.Domain.Models;
using Microsoft.EntityFrameworkCore;

namespace CatalogApi.Data.Concrete;

public class BaseRepository<T, TId> : IBaseRepository<T, TId> where T : BaseEntity<TId>
{
    protected readonly PostgreSqlContext _dbContext;

    protected BaseRepository(PostgreSqlContext dbContext)
    {
        _dbContext = dbContext;
    }

    public virtual async Task<IEnumerable<T>> GetAllAsync(int page, int pageSize)
    {
        return await _dbContext.Set<T>()
            .Where(e => !e.IsDeleted)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
    }

    public virtual async Task<IEnumerable<T>> GetAllAsync()
    {
        return await _dbContext.Set<T>().Where(e => !e.IsDeleted).ToListAsync();
    }

    public virtual async Task<T?> GetByIdAsync(TId id)
    {
        var entity = await _dbContext.FindAsync<T>(id);
        return entity is { IsDeleted: false } ? entity : null;
    }

    public virtual async Task<T> CreateAsync(T entity)
    {
        entity.CreatedAt = DateTime.UtcNow;
        entity.IsDeleted = false;
        _dbContext.Set<T>().Add(entity);
        await _dbContext.SaveChangesAsync();
        return entity;
    }

    public virtual async Task<T> UpdateAsync(TId id, T entity)
    {
        entity.Id = id;
        entity.IsDeleted = false;
        var existingEntity = await GetByIdAsync(id);
        if (existingEntity == null) return null;

        _dbContext.Entry(existingEntity).CurrentValues.SetValues(entity);
        await _dbContext.SaveChangesAsync();

        return existingEntity;
    }

    public virtual async Task<int> SoftDeleteAsync(TId id)
    {
        var entity = await GetByIdAsync(id);
        if (entity != null)
        {
            entity.IsDeleted = true;
            await UpdateAsync(entity.Id, entity);
        }

        return await _dbContext.SaveChangesAsync();
    }
}