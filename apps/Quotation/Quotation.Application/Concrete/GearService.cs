using Quotation.Application.Abstract;
using Quotation.Data.Abstract;
using Quotation.Domain.Models;

namespace Quotation.Application.Concrete;

public class GearService : BaseService<Gear, int>, IGearService
{
    public GearService(IGearRepository repository) : base(repository)
    {
    }

    public Task<double> CalculatePrice(Gear gear)
    {
        throw new NotImplementedException();
    }
}