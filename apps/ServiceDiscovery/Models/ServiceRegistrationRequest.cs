namespace ServiceDiscovery.Models;
public class ServiceRegistrationRequest
{
    public required string ServiceId { get; set; }       
    public required string ServiceName { get; set; }     
    public required string Address { get; set; }         
    public int Port { get; set; }               
    public required string HealthCheckEndpoint { get; set; }
}
