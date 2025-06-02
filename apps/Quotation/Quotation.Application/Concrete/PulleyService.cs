using Quotation.Application.Abstract;
using Quotation.Data.Abstract;
using Quotation.Domain.Models;

namespace Quotation.Application.Concrete;

public class PulleyService : BaseService<Pulley, int>, IPulleyService
{
    public PulleyService(IPulleyRepository repository) : base(repository)
    {
    }
}