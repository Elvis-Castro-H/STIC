using Microsoft.EntityFrameworkCore;
using Quotation.Data.Abstract;
using Quotation.Data.Contexts;
using Quotation.Domain.Models;

namespace Quotation.Data.Concrete;

public class StandardPriceRepository : BaseRepository<StandardPrice, int>, IStandardPriceRepository
{
    protected StandardPriceRepository(PostgreSqlContext dbContext) : base(dbContext)
    {
    }

    public async Task<StandardPrice?> GetByMaterial(MaterialTypes materialType)
    {
        throw new NotImplementedException();
        /*
        var entity = await _dbContext.Set<StandardPrice>()
            .Where(s => s.Material.MaterialType.Equals(materialType))
            .LastOrDefaultAsync();
        return entity is { IsDeleted: false } ? entity : null;*/
    }
}