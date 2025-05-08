using Consul;
using ServiceDiscovery.Dtos;
using ServiceDiscovery.Models;

namespace ServiceDiscovery.Services;

public class ConsulServiceRegister(IConsulClient consulClient) : IServiceRegister
{
    public async Task<ServiceRegistrationOutputDto> RegisterServiceAsync(ServiceRegistrationInputDto input)
    {
        var serviceId = $"{input.ServiceName}-{Guid.NewGuid()}";
        
        var registration = new AgentServiceRegistration
        {
            ID = serviceId,
            Name = input.ServiceName,
            Address = input.Address,
            Port = input.Port,
            Check = new AgentServiceCheck
            {
                HTTP = $"http://{input.Address}:{input.Port}{input.HealthCheckEndpoint}",
                Interval = TimeSpan.FromSeconds(10),
                Timeout = TimeSpan.FromSeconds(5)
            }
        };
        await consulClient.Agent.ServiceRegister(registration);
        return new ServiceRegistrationOutputDto()
        {
            ServiceId = serviceId,
            ServiceName = input.ServiceName,
            Port = input.Port,
            Address = input.Address,
            HealthCheckEndpoint = input.HealthCheckEndpoint
        };
    }

    public async Task DeregisterServiceAsync(string serviceId)
    {
        await consulClient.Agent.ServiceDeregister(serviceId);
    }

    public async Task<Dictionary<string, List<Uri>>> GetAllRegisteredServices()
    {
        var services = await consulClient.Agent.Services();
        var serviceUris = new Dictionary<string, List<Uri>>();

        foreach (var service in services.Response)
        {
            var serviceName = service.Value.Service;
            var serviceUri = new Uri($"http://{service.Value.Address}:{service.Value.Port}");

            if (!serviceUris.ContainsKey(serviceName))
            {
                serviceUris[serviceName] = new List<Uri>();
            }
            serviceUris[serviceName].Add(serviceUri);
        }

        return serviceUris;
    }
}