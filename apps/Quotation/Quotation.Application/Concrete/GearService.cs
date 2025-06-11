using Quotation.Application.Abstract;
using Quotation.Data.Abstract;
using Quotation.Domain.Models;

namespace Quotation.Application.Concrete;

public class GearService : BaseService<Gear, int>, IGearService
{
    private readonly IGearRepository _gearRepository;
    private readonly IMaterialRepository _materialRepository;

    private const double HoursPerTooth = 0.17; 
    private const int QuantityOfPieces = 1;

    public GearService(IGearRepository gearRepository, IMaterialRepository materialRepository) 
        : base(gearRepository)
    {
        _gearRepository = gearRepository;
        _materialRepository = materialRepository;
    }

    public async Task<Gear> CalculatePrice(string material, int toothCount, double module, double pitchDiameter, double outerDiameter, double width, double toothHeight, string gearType)
    {
        var materialToUse = await _materialRepository.GetByNameAsync(material);

        if (materialToUse != null)
        {
            var weight = materialToUse.CalculateWeight(pitchDiameter, materialToUse, outerDiameter, 0);

            var totalJobPrice = (materialToUse.PricePerHourMachine + materialToUse.PricePerHourOperator) * toothCount * HoursPerTooth;

            var materialPrice = QuantityOfPieces * weight * materialToUse.PricePerKg;

            var gear = new Gear()
            {
                TeethCount = toothCount,
                Module = module,
                PitchDiameter = pitchDiameter,
                OuterDiameter = outerDiameter,
                Width = width,
                ToothHeight = toothHeight,
                GearType = Enum.TryParse(gearType, out GearTypes gearTypeEnum) ? gearTypeEnum : GearTypes.Spur,
                Material = materialToUse,
                MaterialId = materialToUse.Id,
                Price = materialPrice + totalJobPrice
            };

            return await _gearRepository.CreateAsync(gear);
        }

        return null;
    }
}
