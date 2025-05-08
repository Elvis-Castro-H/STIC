namespace ServiceDiscovery.Dtos;

public class ServiceRegistrationOutputDto
{
    public required string ServiceId { get; set; }            
    public required string ServiceName { get; set; }          
    public required string Address { get; set; }              
    public required int Port { get; set; }                    
    public required string HealthCheckEndpoint { get; set; }  
}