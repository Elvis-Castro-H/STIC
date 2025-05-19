namespace CatalogApi.API.DTOs.Product;

public class ProductInputDto : IMapFrom<Domain.Models.Product>
{
    public string Name { get; set; }
    public string Description { get; set; }
    public decimal Price { get; set; }
    public string Image { get; set; }
    public List<string> Images { get; set; }
    public int CategoryId { get; set; }
    public int Stock { get; set; }
    public string Details { get; set; }
}