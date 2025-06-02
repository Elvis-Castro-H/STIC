using Quotation.Domain.Models;

namespace Quotation.Data.Abstract;

public interface IStandardPriceRepository : IBaseRepository<StandardPrice, int>
{
    Task<StandardPrice?> GetByMaterial(MaterialTypes materialType);
}