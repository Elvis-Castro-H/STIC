using VehicleDataIntegrator.Domain.Models;

namespace VehicleDataIntegrator.Infrastructure.Abstract;

public interface IWheelDetailsIntegration
{
    Task<IEnumerable<WheelDetails>> GetWheelFitmentAsync(string make, string model, int year);
}