namespace Quotation.Tests.Application.Concrete;

using Xunit;
using Moq;
using Quotation.Application.Concrete;
using Data.Abstract;
using Domain.Models;
using System.Threading.Tasks;


public class SpacerServiceTests
{
    private readonly Mock<ISpacerRepository> _spacerRepoMock;
    private readonly Mock<IMaterialRepository> _materialRepoMock;
    private readonly SpacerService _service;

    public SpacerServiceTests()
    {
        _spacerRepoMock = new Mock<ISpacerRepository>();
        _materialRepoMock = new Mock<IMaterialRepository>();

        _service = new SpacerService(_spacerRepoMock.Object, _materialRepoMock.Object);
    }
    
    [Fact]
    public async Task CalculatePrice_ShouldReturnNull_WhenMaterialNotFound()
    {
        // Arrange
        _materialRepoMock.Setup(r => r.GetByNameAsync(It.IsAny<string>()))
            .ReturnsAsync((Material)null);

        // Act
        var result = await _service.CalculatePrice("Unknown", 1.5, 
            "Ford", "Ranger", 2015);

        // Assert
        Assert.Null(result);
    }

    [Fact]
    public async Task CalculatePrice_ShouldReturnSpacer_WithCorrectPrice()
    {
        // Arrange
        string materialName = "Aluminum";
        double inches = 2.0;
        string make = "Toyota";
        string model = "Tacoma";
        int year = 2010;

        var fakeMaterial = new FakeMaterial
        {
            Id = 1,
            Name = materialName,
            PricePerKg = 100,
            PricePerHourMachine = 30,
            PricePerHourOperator = 20
        };

        var wheelDetails = new WheelDetails
        {
            BoltCount = 6,
            BoltPattern = 139.7,
            CenterBore = 106.1
        };

        _materialRepoMock.Setup(r => r.GetByNameAsync(materialName)).ReturnsAsync(fakeMaterial);
        _spacerRepoMock.Setup(r => r.GetWheelDetails(make, model, year)).ReturnsAsync(wheelDetails);
        _spacerRepoMock.Setup(r => r.CreateAsync(It.IsAny<Spacer>())).ReturnsAsync((Spacer s) => s);

        // Act
        var result = await _service.CalculatePrice(materialName, inches, make, model, year);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(6, result.BoltCount);
        Assert.Equal(139.7, result.BoltPattern);
        Assert.Equal(106.1, result.CenterBore);
        Assert.Equal(fakeMaterial, result.Material);
        Assert.Equal(1, result.MaterialId);
        Assert.Equal(inches, result.ThicknessMm);
        Assert.True(result.Price > 0);
    }
}
