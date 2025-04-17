using CatalogApi.Data.Abstract;
using CatalogApi.Data.Contexts;
using CatalogApi.Domain.Models;

namespace CatalogApi.Data.Concrete;

public class ProductRepository : BaseRepository<Product, int>, IProductRepository
{
    public ProductRepository(PostgreSqlContext dbContext) : base(dbContext)
    {
    }
}