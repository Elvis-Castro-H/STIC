using VehicleDataIntegrator.Application.Abstract;
using VehicleDataIntegrator.Domain.Models;
using VehicleDataIntegrator.Infrastructure.Abstract;

namespace VehicleDataIntegrator.Application.Concrete;

public class WheelFitmentService : IWheelDetailsService
{
    private readonly IWheelDetailsIntegration _integration;

    public WheelFitmentService(IWheelDetailsIntegration integration)
    {
        _integration = integration;
    }

    public async Task<List<WheelDetails>> GetWheelFitmentsAsync(string make, string model, int year)
    {
        var rawData = await _integration.GetWheelFitmentAsync(make, model, year);

        var grouped = rawData
            .GroupBy(d => new
            {
                d.BoltCount,
                d.BoltPattern,
                d.CenterBore,
                d.LugType,
                d.ThreadSize
            })
            .ToList();

        var result = grouped.Select(g => new WheelDetails()
        {
            Make = make,
            Model = model,
            Year = year,
            BoltCount = g.Key.BoltCount,
            BoltPattern = g.Key.BoltPattern,
            CenterBore = g.Key.CenterBore,
            LugType = g.Key.LugType,
            ThreadSize = g.Key.ThreadSize
        }).ToList();

        return result;
    }
}
