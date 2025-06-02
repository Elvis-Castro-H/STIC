using Quotation.Domain.Models;

namespace Quotation.Application.Abstract;

public interface IGearService : IBaseService<Gear, int>
{
    Task<double> CalculatePrice(Gear gear);
}