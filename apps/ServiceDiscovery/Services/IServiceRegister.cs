namespace ServiceDiscovery.Services;

using ServiceDiscovery.Dtos;

public interface IServiceRegister
{
    Task<ServiceRegistrationOutputDto> RegisterServiceAsync(ServiceRegistrationInputDto input);
    Task DeregisterServiceAsync(string serviceId);
    Task<Dictionary<string, List<Uri>>> GetAllRegisteredServices();
}
