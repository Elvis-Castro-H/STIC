using CatalogApi.Application.Abstract;
using CatalogApi.Data.Abstract;
using CatalogApi.Domain.Models;

namespace CatalogApi.Application.Concrete;

public class ProductService(IProductRepository repository) : BaseService<Product, int>(repository), IProductService;