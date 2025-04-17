using CatalogApi.Application.Abstract;
using CatalogApi.Data.Abstract;
using CatalogApi.Domain.Models;

namespace CatalogApi.Application.Concrete;

public class CategoryService(ICategoryRepository repository) : BaseService<Category, int>(repository), ICategoryService;