namespace Quotation.API.Dtos.StandardPrice;

public class StandardPriceOutputDto : StandardPriceInputDto
{
    public required int Id { get; set; }
    public DateTime CreatedAt { get; set; }
}