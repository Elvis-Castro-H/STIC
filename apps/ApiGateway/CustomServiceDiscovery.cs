namespace ApiGateway;

using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;

public class CustomServiceDiscovery
{
    private readonly HttpClient _httpClient;
    private readonly string _serviceRegistryUrl;

    public CustomServiceDiscovery(HttpClient httpClient)
    {
        _httpClient = httpClient;
        _serviceRegistryUrl = Environment.GetEnvironmentVariable("SERVICE_DISCOVERY_URL") 
                              ?? throw new Exception("SERVICE_DISCOVERY_URL not set in environment variables.");
    }

    private async Task<Dictionary<string, List<string>>> GetServicesAsync()
    {
        var response = await _httpClient.GetStringAsync(_serviceRegistryUrl);
        return JsonSerializer.Deserialize<Dictionary<string, List<string>>>(response);
    }

    public async Task<string> GetServiceUriAsync(string serviceName)
    {
        var services = await GetServicesAsync();
        return services.ContainsKey(serviceName) ? services[serviceName].FirstOrDefault() : null;
    }
}