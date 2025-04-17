using CatalogApi.Domain.Models;

namespace CatalogApi.Data.Abstract;

public interface IProductRepository : IBaseRepository<Product, int>
{
    
}