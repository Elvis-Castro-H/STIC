using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Quotation.API.Dtos.StandardPrice;
using Quotation.Application.Abstract;
using Quotation.Application.Concrete;
using Quotation.Domain.Models;

namespace Quotation.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class StandardPriceController : BaseController<StandardPrice, StandardPriceOutputDto, StandardPriceInputDto, int>
{
    public StandardPriceController(IMapper mapper, StandardPriceService service) : base(mapper, service)
    {
    }
}