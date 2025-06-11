using Quotation.Application.Abstract;
using Quotation.Data.Abstract;
using Quotation.Domain.Models;

namespace Quotation.Application.Concrete;

public class PulleyService : BaseService<Pulley, int>, IPulleyService
{
    private readonly IPulleyRepository _repository;
    private readonly IMaterialRepository _materialRepository;

    private const double HoursPerChannel = 1.5; 
    private const double MeasureToAddToDiameter = 60;
    private const int QuantityOfPieces = 1;

    public PulleyService(IPulleyRepository repository, IMaterialRepository materialRepository) : base(repository)
    {
        _repository = repository;
        _materialRepository = materialRepository;
    }

    public async Task<Pulley> CalculatePrice(string material, double outerDiameter, double innerBoreDiameter, double width, int grooveCount, char grooveType)
    {
        var materialToUse = await _materialRepository.GetByNameAsync(material);

        if (materialToUse != null)
        {
            
            var weight = materialToUse.CalculateWeight(outerDiameter, materialToUse, width, MeasureToAddToDiameter);
            
            var totalJobPrice = (materialToUse.PricePerHourMachine + materialToUse.PricePerHourOperator) + (grooveCount * HoursPerChannel);
            var materialPrice = QuantityOfPieces * weight * materialToUse.PricePerKg;
            
            var pulley = new Pulley()
            {
                OuterDiameter = outerDiameter,
                InnerBoreDiameter = innerBoreDiameter,
                Width = width,
                GrooveCount = grooveCount,
                GrooveType = grooveType,
                Material = materialToUse,
                MaterialId = materialToUse.Id,
                Price = materialPrice + totalJobPrice
            };
            
            return await _repository.CreateAsync(pulley);
        }

        return null;  
    }
}
