using Microsoft.AspNetCore.Mvc;
using ServiceDiscovery.Dtos;
using ServiceDiscovery.Services;

namespace ServiceDiscovery.Controllers;

[ApiController]
[Route("api/service-registry")]
public class ServiceRegistryController : ControllerBase
{
    private readonly IServiceRegister _serviceRegistrar;

    public ServiceRegistryController(IServiceRegister serviceRegistrar)
    {
        _serviceRegistrar = serviceRegistrar;
    }

    [HttpPost("register")]
    public async Task<IActionResult> RegisterService([FromBody] ServiceRegistrationInputDto input)
    {
        var registrationDto = new ServiceRegistrationInputDto
        {
            ServiceName = input.ServiceName,
            Address = input.Address,
            Port = input.Port,
            HealthCheckEndpoint = input.HealthCheckEndpoint
        };

        var registered = await _serviceRegistrar.RegisterServiceAsync(registrationDto);

        return Ok(registered);
    }

    [HttpDelete("deregister/{serviceId}")]
    public async Task<IActionResult> DeregisterService(string serviceId)
    {
        await _serviceRegistrar.DeregisterServiceAsync(serviceId);
        return Ok("Service deregistered successfully.");
    }

    [HttpGet("services")]
    public async Task<IActionResult> GetRegisteredServices()
    {
        var services = await _serviceRegistrar.GetAllRegisteredServices();
        return Ok(services);
    }
}