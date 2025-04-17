namespace CatalogApi.Domain.Models;

public abstract class BaseEntity <TId>
{
    public required TId Id { get; set; }
    public bool IsDeleted { get; set; }
    public DateTime CreatedAt { get; set; }
}