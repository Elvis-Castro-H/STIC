namespace VehicleDataIntegrator.Domain.Models;

public abstract class Vehicle
{
    public string Make { get; set; }             
    public string Model { get; set; }            
    public int Year { get; set; }
}