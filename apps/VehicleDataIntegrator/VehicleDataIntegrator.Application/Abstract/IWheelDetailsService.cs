using VehicleDataIntegrator.Domain.Models;

namespace VehicleDataIntegrator.Application.Abstract;

public interface IWheelDetailsService
{
    Task<List<WheelDetails>> GetWheelFitmentsAsync(string make, string model, int year);
}