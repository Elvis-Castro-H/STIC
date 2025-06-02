namespace Quotation.API.Dtos.StandardPrice;

public class StandardPriceInputDto : IMapFrom<Domain.Models.StandardPrice>
{
    public int MaterialId { get; set; }
    public double PricePerHourMachine { get; set; }
    public double PricePerHourOperator { get; set; }
}