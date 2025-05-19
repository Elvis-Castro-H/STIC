namespace CatalogApi.Domain.Models;

public class Category : BaseEntity<int>
{
    public string Name { get; set; }
    public string Description { get; set; }
    public string Image { get; set; }
    
    public ICollection<Product> Products { get; set; }
}