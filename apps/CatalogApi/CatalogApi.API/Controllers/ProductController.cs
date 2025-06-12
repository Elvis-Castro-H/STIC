using AutoMapper;
using CatalogApi.API.DTOs.Product;
using CatalogApi.Application.Abstract;
using CatalogApi.Domain.Models;
using Microsoft.AspNetCore.Mvc;

namespace CatalogApi.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductController : ControllerBase
{
    private readonly IProductService _productService;
    private readonly IMapper _mapper;

    public ProductController(IProductService productService, IMapper mapper)
    {
        _productService = productService;
        _mapper = mapper;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ProductOutputDto>>> GetAllAsync()
    {
        var entities = await _productService.GetAllAsync();
        var result = _mapper.Map<IEnumerable<ProductOutputDto>>(entities);
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ProductOutputDto>> GetByIdAsync(int id)
    {
        var entity = await _productService.GetByIdAsync(id);
        if (entity == null) return NotFound();

        var result = _mapper.Map<ProductOutputDto>(entity);
        return Ok(result);
    }

    [HttpPost]
    public async Task<ActionResult<ProductOutputDto>> CreateAsync([FromBody] ProductInputDto dto)
    {
        var entity = _mapper.Map<Product>(dto);
        var created = await _productService.CreateAsync(entity);

        var result = _mapper.Map<ProductOutputDto>(created);
        return Created($"api/product/{result.Id}", result);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<ProductOutputDto>> UpdateAsync(int id, [FromBody] ProductInputDto dto)
    {
        var entity = _mapper.Map<Product>(dto);
        var updated = await _productService.UpdateAsync(id, entity);

        if (updated == null) return NotFound();

        var result = _mapper.Map<ProductOutputDto>(updated);
        return Ok(result);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteAsync(int id)
    {
        var success = await _productService.SoftDeleteAsync(id);
        if (success == 0) return NotFound();
        return NoContent();
    }
}
