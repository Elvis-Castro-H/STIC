namespace Quotation.Domain.Models;

public class Spacer : QuotableProduct
{
    public int BoltCount { get; set; }
    public double BoltPattern { get; set; }
    public double ThicknessMm { get; set; }
    public double CenterBore { get; set; }
    public bool IsHubCentric { get; set; }
}