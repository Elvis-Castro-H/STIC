using Quotation.Domain.Models;

namespace Quotation.Application.Abstract;

public interface ISpacerService : IBaseService<Spacer, int>
{
    Task<double> CalculatePrice(String material, double inches, string make, string model, int year);
}