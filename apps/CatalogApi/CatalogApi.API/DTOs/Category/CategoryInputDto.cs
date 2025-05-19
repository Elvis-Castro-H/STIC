namespace CatalogApi.API.DTOs.Category;

public class CategoryInputDto : IMapFrom<Domain.Models.Category>
{
    public string Name { get; set; }
    public string Description { get; set; }
    public string Image { get; set; }
}
