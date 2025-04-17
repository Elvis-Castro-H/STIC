using AutoMapper;
using CatalogApi.API.DTOs.Category;
using CatalogApi.Application.Abstract;
using CatalogApi.Domain.Models;
using Microsoft.AspNetCore.Mvc;

namespace CatalogApi.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoryController : ControllerBase
{
    private readonly ICategoryService _categoryService;
    private readonly IMapper _mapper;

    public CategoryController(ICategoryService categoryService, IMapper mapper)
    {
        _categoryService = categoryService;
        _mapper = mapper;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<CategoryOutputDto>>> GetAllAsync()
    {
        var entities = await _categoryService.GetAllAsync();
        var result = _mapper.Map<IEnumerable<CategoryOutputDto>>(entities);
        return Ok(result);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<CategoryOutputDto>> GetByIdAsync(int id)
    {
        var entity = await _categoryService.GetByIdAsync(id);
        if (entity == null) return NotFound();

        var result = _mapper.Map<CategoryOutputDto>(entity);
        return Ok(result);
    }

    [HttpPost]
    public async Task<ActionResult<CategoryOutputDto>> CreateAsync([FromBody] CategoryInputDto dto)
    {
        var entity = _mapper.Map<Category>(dto);
        var created = await _categoryService.CreateAsync(entity);

        var result = _mapper.Map<CategoryOutputDto>(created);
        return Created($"api/category/{result.Id}", result);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<CategoryOutputDto>> UpdateAsync(int id, [FromBody] CategoryInputDto dto)
    {
        var entity = _mapper.Map<Category>(dto);
        var updated = await _categoryService.UpdateAsync(id, entity);

        if (updated == null) return NotFound();

        var result = _mapper.Map<CategoryOutputDto>(updated);
        return Ok(result);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteAsync(int id)
    {
        var success = await _categoryService.SoftDeleteAsync(id);
        if (success == 0) return NotFound();
        return NoContent();
    }
}
