using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Quotation.API.Dtos.Spacer;
using Quotation.Application.Abstract;
using Quotation.Domain.Models;
using EventWrapper = Quotation.Domain.Models.EventWrapper;

namespace Quotation.API.Controllers;

[ApiController]
[Route("api/quotation/[controller]")]
public class SpacerController : BaseController<Spacer, SpacerOutputDto, SpacerInputDto, int>
{
    private readonly ISpacerService _spacerService;

    public SpacerController(IMapper mapper, ISpacerService service, ISpacerService spacerService) : base(mapper, service)
    {
        _spacerService = spacerService;
    }

    [HttpPost("/quotation")]
    public async Task<ActionResult<int>> GetQuotation([FromBody] QuotationDetailsDto quotationDetails)
    {
        var totalPrice = await _spacerService.CalculatePrice(quotationDetails.Material,
            quotationDetails.Inches, quotationDetails.Make, quotationDetails.Model,
            quotationDetails.Year);
        return Ok(totalPrice);
    }
    
    [HttpPost("receiver")]
    public IActionResult Receive([FromBody] EventWrapper eventWrapper)
    {
        SpacerRepository.ReceiveEventWebhook(eventWrapper);
        return Ok();
    }
}