namespace ServiceDiscovery.Dtos;

public class ServiceRegistrationInputDto
{
    public required string ServiceName { get; set; }      
    public required string Address { get; set; }           
    public int Port { get; set; }                 
    public required string HealthCheckEndpoint { get; set; }
}