using VehicleDataIntegrator.Application.Abstract;
using VehicleDataIntegrator.Domain.Models;

using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace VehicleDataIntegrator.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class WheelDetailsController : ControllerBase
{
    private readonly IWheelDetailsService _wheelDetailsService;

    public WheelDetailsController(IWheelDetailsService wheelDetailsService)
    {
        _wheelDetailsService = wheelDetailsService;
    }

    /// <summary>
    /// Retrieves the unique wheel fitment configurations for a specific vehicle.
    /// </summary>
    /// <param name="make">Vehicle make (e.g., Toyota)</param>
    /// <param name="model">Vehicle model (e.g., Corolla)</param>
    /// <param name="year">Vehicle year (e.g., 2020)</param>
    /// <returns>A list of unique wheel fitment configurations</returns>
    [HttpGet]
    public async Task<ActionResult<List<WheelDetails>>> GetWheelFitments(
        [FromQuery] string make,
        [FromQuery] string model,
        [FromQuery] int year)
    {
        if (string.IsNullOrWhiteSpace(make) || string.IsNullOrWhiteSpace(model) || year <= 0)
            return BadRequest("Invalid parameters. Make, model, and a valid year are required.");

        var result = await _wheelDetailsService.GetWheelFitmentsAsync(make, model, year);

        if (result == null || result.Count == 0)
            return NotFound("No wheel fitment data found for the specified vehicle.");

        return Ok(result);
    }
}