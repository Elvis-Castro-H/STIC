using VehicleDataIntegrator.Domain.Models;

namespace VehicleDataIntegrator.Infrastructure.Abstract;

public interface IWheelDetailsIntegration
{
    Task<IEnumerable<WheelDetails>> GetWheelFitmentAsync(string make, string model, int year);
    Task<IEnumerable<string>> GetAllMakesAsync();
    Task<IEnumerable<string>> GetModelsByMakeAsync(string make);
    Task<IEnumerable<int>> GetYearsByMakeAndModelAsync(string make, string model);
}