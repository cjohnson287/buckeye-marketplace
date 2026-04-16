using System.Security.Claims;
using backend.Data;
using backend.DTOs;
using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class OrdersController : ControllerBase
{
    private static readonly HashSet<string> AllowedStatuses =
    ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

    private readonly MarketplaceContext _context;

    public OrdersController(MarketplaceContext context)
    {
        _context = context;
    }

    [HttpPost]
    [ProducesResponseType(typeof(OrderResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<OrderResponse>> CreateOrder([FromBody] CreateOrderRequest request)
    {
        var userId = GetUserId();
        if (userId is null)
        {
            return Unauthorized();
        }

        var cart = await _context.Carts
            .Include(c => c.Items)
            .ThenInclude(ci => ci.Product)
            .FirstOrDefaultAsync(c => c.UserId == userId);

        if (cart is null || cart.Items.Count == 0)
        {
            return BadRequest(new ProblemDetails
            {
                Title = "Empty cart",
                Detail = "Cannot place an order with an empty cart.",
                Status = StatusCodes.Status400BadRequest
            });
        }

        var orderItems = cart.Items.Select(item => new OrderItem
        {
            ProductId = item.ProductId,
            ProductTitle = item.Product.Title,
            UnitPrice = item.Product.Price,
            Quantity = item.Quantity,
            Subtotal = item.Quantity * item.Product.Price
        }).ToList();

        var total = OrderPricingService.CalculateTotal(orderItems.Select(i => i.Subtotal));

        var order = new Order
        {
            UserId = userId,
            OrderDate = DateTime.UtcNow,
            Status = "Pending",
            Total = total,
            ShippingAddress = request.ShippingAddress,
            ConfirmationNumber = OrderConfirmationNumberGenerator.Generate(DateTime.UtcNow),
            Items = orderItems
        };

        _context.Orders.Add(order);
        _context.CartItems.RemoveRange(cart.Items);
        cart.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetMine), new { }, MapOrderToResponse(order));
    }

    [HttpGet("mine")]
    [ProducesResponseType(typeof(IEnumerable<OrderResponse>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<OrderResponse>>> GetMine()
    {
        var userId = GetUserId();
        if (userId is null)
        {
            return Unauthorized();
        }

        var orders = await _context.Orders
            .Include(o => o.Items)
            .Where(o => o.UserId == userId)
            .OrderByDescending(o => o.OrderDate)
            .ToListAsync();

        return Ok(orders.Select(MapOrderToResponse));
    }

    [HttpGet]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(typeof(IEnumerable<OrderResponse>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<OrderResponse>>> GetAll()
    {
        var orders = await _context.Orders
            .Include(o => o.Items)
            .OrderByDescending(o => o.OrderDate)
            .ToListAsync();

        return Ok(orders.Select(MapOrderToResponse));
    }

    [HttpPut("{orderId:int}/status")]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(typeof(OrderResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<OrderResponse>> UpdateStatus(int orderId, [FromBody] UpdateOrderStatusRequest request)
    {
        if (!AllowedStatuses.Contains(request.Status))
        {
            return BadRequest(new ProblemDetails
            {
                Title = "Invalid status",
                Detail = $"Status must be one of: {string.Join(", ", AllowedStatuses)}",
                Status = StatusCodes.Status400BadRequest
            });
        }

        var order = await _context.Orders
            .Include(o => o.Items)
            .FirstOrDefaultAsync(o => o.Id == orderId);

        if (order is null)
        {
            return NotFound();
        }

        order.Status = request.Status;
        await _context.SaveChangesAsync();

        return Ok(MapOrderToResponse(order));
    }

    private string? GetUserId()
    {
        return User.FindFirstValue(ClaimTypes.NameIdentifier);
    }

    private static OrderResponse MapOrderToResponse(Order order)
    {
        return new OrderResponse(
            order.Id,
            order.OrderDate,
            order.Status,
            order.Total,
            order.ShippingAddress,
            order.ConfirmationNumber,
            order.Items.Select(item => new OrderItemResponse(
                item.Id,
                item.ProductId,
                item.ProductTitle,
                item.UnitPrice,
                item.Quantity,
                item.Subtotal
            )).ToList()
        );
    }
}
