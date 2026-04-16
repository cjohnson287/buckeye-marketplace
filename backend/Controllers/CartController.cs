using backend.Data;
using backend.DTOs;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class CartController : ControllerBase
{
    private readonly MarketplaceContext _context;

    public CartController(MarketplaceContext context)
    {
        _context = context;
    }

    /// <summary>
    /// GET /api/cart - Retrieve the user's cart
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<CartDto>> GetCart()
    {
        var userId = GetUserId();
        if (userId is null)
            return Unauthorized();

        var cart = await _context.Carts
            .Include(c => c.Items)
            .ThenInclude(ci => ci.Product)
            .FirstOrDefaultAsync(c => c.UserId == userId);

        if (cart == null)
        {
            // Return empty cart
            return Ok(new CartDto(0, new List<CartItemDto>(), 0m));
        }

        var cartDto = MapToDto(cart);
        return Ok(cartDto);
    }

    /// <summary>
    /// POST /api/cart - Add an item to the cart
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<CartDto>> AddToCart([FromBody] AddToCartRequest request)
    {
        var userId = GetUserId();
        if (userId is null)
            return Unauthorized();

        // Validate request
        if (request.Quantity < 1)
            return BadRequest(new { error = "Quantity must be at least 1" });

        // Check if product exists
        var product = await _context.Products.FindAsync(request.ProductId);
        if (product == null)
            return NotFound(new { error = "Product not found" });

        // Get or create cart
        var cart = await _context.Carts
            .Include(c => c.Items)
            .ThenInclude(ci => ci.Product)
            .FirstOrDefaultAsync(c => c.UserId == userId);

        if (cart == null)
        {
            cart = new Cart { UserId = userId };
            _context.Carts.Add(cart);
            await _context.SaveChangesAsync();
        }

        // Check if item already in cart
        var existingItem = cart.Items.FirstOrDefault(ci => ci.ProductId == request.ProductId);
        if (existingItem != null)
        {
            existingItem.Quantity += request.Quantity;
            existingItem.Subtotal = existingItem.Quantity * product.Price;
        }
        else
        {
            var newItem = new CartItem
            {
                CartId = cart.Id,
                ProductId = request.ProductId,
                Quantity = request.Quantity,
                Subtotal = request.Quantity * product.Price
            };
            cart.Items.Add(newItem);
        }

        cart.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        var updatedCart = await _context.Carts
            .Include(c => c.Items)
            .ThenInclude(ci => ci.Product)
            .FirstAsync(c => c.Id == cart.Id);

        return CreatedAtAction(nameof(GetCart), MapToDto(updatedCart));
    }

    /// <summary>
    /// PUT /api/cart/{cartItemId} - Update item quantity
    /// </summary>
    [HttpPut("{cartItemId}")]
    public async Task<ActionResult<CartDto>> UpdateQuantity(int cartItemId, [FromBody] UpdateCartItemRequest request)
    {
        var userId = GetUserId();
        if (userId is null)
            return Unauthorized();

        if (request.Quantity < 1)
            return BadRequest(new { error = "Quantity must be at least 1" });

        var cartItem = await _context.CartItems
            .Include(ci => ci.Cart)
            .Include(ci => ci.Product)
            .FirstOrDefaultAsync(ci => ci.Id == cartItemId);

        if (cartItem == null)
            return NotFound(new { error = "Cart item not found" });

        if (cartItem.Cart.UserId != userId)
            return Forbid();

        cartItem.Quantity = request.Quantity;
        cartItem.Subtotal = request.Quantity * cartItem.Product.Price;
        cartItem.Cart.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        var updatedCart = await _context.Carts
            .Include(c => c.Items)
            .ThenInclude(ci => ci.Product)
            .FirstAsync(c => c.Id == cartItem.CartId);

        return Ok(MapToDto(updatedCart));
    }

    /// <summary>
    /// DELETE /api/cart/{cartItemId} - Remove item from cart
    /// </summary>
    [HttpDelete("{cartItemId}")]
    public async Task<ActionResult<CartDto>> RemoveFromCart(int cartItemId)
    {
        var userId = GetUserId();
        if (userId is null)
            return Unauthorized();

        var cartItem = await _context.CartItems
            .Include(ci => ci.Cart)
            .FirstOrDefaultAsync(ci => ci.Id == cartItemId);

        if (cartItem == null)
            return NotFound(new { error = "Cart item not found" });

        if (cartItem.Cart.UserId != userId)
            return Forbid();

        var cartId = cartItem.CartId;
        _context.CartItems.Remove(cartItem);
        cartItem.Cart.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        var updatedCart = await _context.Carts
            .Include(c => c.Items)
            .ThenInclude(ci => ci.Product)
            .FirstAsync(c => c.Id == cartId);

        return Ok(MapToDto(updatedCart));
    }

    /// <summary>
    /// DELETE /api/cart/clear - Clear entire cart
    /// </summary>
    [HttpDelete("clear")]
    public async Task<ActionResult<CartDto>> ClearCart()
    {
        var userId = GetUserId();
        if (userId is null)
            return Unauthorized();

        var cart = await _context.Carts
            .Include(c => c.Items)
            .FirstOrDefaultAsync(c => c.UserId == userId);

        if (cart == null)
            return Ok(new CartDto(0, new List<CartItemDto>(), 0m));

        _context.CartItems.RemoveRange(cart.Items);
        cart.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return Ok(MapToDto(cart));
    }

    private string? GetUserId()
    {
        return User.FindFirstValue(ClaimTypes.NameIdentifier);
    }

    private CartDto MapToDto(Cart cart)
    {
        var items = cart.Items
            .Select(ci => new CartItemDto(
                ci.Id,
                ci.ProductId,
                ci.Product.Title,
                ci.Product.Price,
                ci.Quantity,
                ci.Subtotal
            ))
            .ToList();

        var total = items.Sum(item => item.Subtotal);
        return new CartDto(cart.Id, items, total);
    }
}
