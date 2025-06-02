using VehicleDataIntegrator.Application.Abstract;
using VehicleDataIntegrator.Domain.Models;

using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using VehicleDataIntegrator.API.Dtos;

namespace VehicleDataIntegrator.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class WheelDetailsController : ControllerBase
    {
        private readonly IWheelDetailsService _wheelDetailsService;
        private readonly HttpClient _httpClient;
        private readonly string _eventBusPublishUrl = "http://localhost:5233/api/events/publish"; // Cambia al URL real del Event Bus

        public WheelDetailsController(IWheelDetailsService wheelDetailsService)
        {
            _wheelDetailsService = wheelDetailsService;
            _httpClient = new HttpClient();
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

        [HttpPost("request")]
        public async Task<IActionResult> HandleWheelDetailsRequest([FromBody] EventWrapper eventWrapper)
        {
            var request = eventWrapper.Data;
            if (string.IsNullOrWhiteSpace(request.Make) || string.IsNullOrWhiteSpace(request.Model) || request.Year <= 0)
                return BadRequest("Parámetros inválidos. Se requieren Make, Model y un Year válido.");

            var fitments = await _wheelDetailsService.GetWheelFitmentsAsync(request.Make, request.Model, request.Year);

            if (fitments.Count == 0)
                return NotFound("No se encontraron configuraciones de ruedas para el vehículo especificado.");

            // Construir el evento WheelDetailsResponse
            var eventResponsePayload = new
            {
                EventType = "WheelDetailsResponse",
                Data = new
                {
                    CorrelationId = request.CorrelationId,
                    Make = fitments.First().Make,
                    Model = fitments.First().Model,
                    Year = fitments.First().Year,
                    Region = fitments.First().Region,
                    BoltCount = fitments.First().BoltCount,
                    BoltPattern = fitments.First().BoltPattern,
                    CenterBore = fitments.First().CenterBore,
                }
            };


            var response = await _httpClient.PostAsJsonAsync(_eventBusPublishUrl, eventResponsePayload);

            if (!response.IsSuccessStatusCode)
                return StatusCode((int)response.StatusCode, "Error publicando WheelDetailsResponse al Event Bus.");

            return Ok("Solicitud procesada y evento WheelDetailsResponse publicado.");
        }
    }
}
