using CatalogApi.Data.Abstract;
using CatalogApi.Data.Contexts;
using CatalogApi.Domain.Models;

namespace CatalogApi.Data.Concrete;

public class CategoryRepository : BaseRepository<Category, int>, ICategoryRepository
{
    public CategoryRepository(PostgreSqlContext dbContext) : base(dbContext)
    {
    }
}