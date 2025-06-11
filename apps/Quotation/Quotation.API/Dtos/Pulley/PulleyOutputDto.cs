namespace Quotation.API.Dtos.Pulley;

public class PulleyOutputDto : PulleyInputDto
{
    public double Price { get; set; }
    public string? UserId { get; set; } 
}