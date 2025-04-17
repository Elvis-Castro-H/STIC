using CatalogApi.API.DTOs.Product;

namespace CatalogApi.API.DTOs.Category;

public class CategoryOutputDto : IMapFrom<Domain.Models.Category>
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public string ImageUrl { get; set; }
}
