using backend.Data;
using backend.DTOs;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly MarketplaceContext _context;

    public ProductsController(MarketplaceContext context)
    {
        _context = context;
    }

    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<ProductResponse>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<ProductResponse>>> GetAll(
        [FromQuery] string? category,
        [FromQuery] decimal? minPrice,
        [FromQuery] decimal? maxPrice)
    {
        var query = _context.Products
            .Include(p => p.Category)
            .AsQueryable();

        if (!string.IsNullOrEmpty(category))
            query = query.Where(p => p.Category.Name == category);

        if (minPrice.HasValue)
            query = query.Where(p => p.Price >= minPrice.Value);

        if (maxPrice.HasValue)
            query = query.Where(p => p.Price <= maxPrice.Value);

        var products = await query.ToListAsync();

        return Ok(products.Select(p => new ProductResponse(
            p.Id,
            p.Title,
            p.Description,
            p.Price,
            p.Category.Name,
            p.SellerName,
            p.ImageUrl,
            p.PostedDate
        )));
    }

    [HttpGet("{id}")]
    [ProducesResponseType(typeof(ProductResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ProductResponse>> GetById(int id)
    {
        var product = await _context.Products
            .Include(p => p.Category)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (product is null)
            return NotFound();

        return Ok(new ProductResponse(
            product.Id,
            product.Title,
            product.Description,
            product.Price,
            product.Category.Name,
            product.SellerName,
            product.ImageUrl,
            product.PostedDate
        ));
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(typeof(ProductResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<ProductResponse>> Create([FromBody] CreateProductRequest request)
    {
        var category = await _context.Categories.FindAsync(request.CategoryId);
        if (category is null)
        {
            return BadRequest(new ProblemDetails
            {
                Title = "Invalid category",
                Detail = $"Category with id {request.CategoryId} does not exist.",
                Status = StatusCodes.Status400BadRequest
            });
        }

        var product = new Product
        {
            Title = request.Title,
            Description = request.Description,
            Price = request.Price,
            CategoryId = request.CategoryId,
            SellerName = request.SellerName,
            ImageUrl = request.ImageUrl,
            PostedDate = DateTime.UtcNow
        };

        _context.Products.Add(product);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = product.Id }, new ProductResponse(
            product.Id,
            product.Title,
            product.Description,
            product.Price,
            category.Name,
            product.SellerName,
            product.ImageUrl,
            product.PostedDate
        ));
    }

    [HttpPut("{id:int}")]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(typeof(ProductResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<ProductResponse>> Update(int id, [FromBody] UpdateProductRequest request)
    {
        var product = await _context.Products.FirstOrDefaultAsync(p => p.Id == id);
        if (product is null)
            return NotFound();

        var category = await _context.Categories.FindAsync(request.CategoryId);
        if (category is null)
        {
            return BadRequest(new ProblemDetails
            {
                Title = "Invalid category",
                Detail = $"Category with id {request.CategoryId} does not exist.",
                Status = StatusCodes.Status400BadRequest
            });
        }

        product.Title = request.Title;
        product.Description = request.Description;
        product.Price = request.Price;
        product.CategoryId = request.CategoryId;
        product.SellerName = request.SellerName;
        product.ImageUrl = request.ImageUrl;

        await _context.SaveChangesAsync();

        return Ok(new ProductResponse(
            product.Id,
            product.Title,
            product.Description,
            product.Price,
            category.Name,
            product.SellerName,
            product.ImageUrl,
            product.PostedDate
        ));
    }

    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(int id)
    {
        var product = await _context.Products.FirstOrDefaultAsync(p => p.Id == id);
        if (product is null)
            return NotFound();

        _context.Products.Remove(product);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
