namespace CatalogApi.Domain.Models;

public class Product : BaseEntity<int>
{
    public string Name { get; set; }
    public string Description { get; set; }
    public decimal Price { get; set; }
    public string Image { get; set; }
    public List<string> Images { get; set; }
    public int CategoryId { get; set; } 
    public int Stock { get; set; }
    public string Details { get; set; } 
    
    public Category Category { get; set; }
}