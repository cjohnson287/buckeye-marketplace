using System.ComponentModel.DataAnnotations;

namespace backend.DTOs;

public record CreateOrderRequest(
    [Required, MaxLength(500)] string ShippingAddress
);

public record UpdateOrderStatusRequest(
    [Required, MaxLength(50)] string Status
);

public record OrderItemResponse(
    int Id,
    int ProductId,
    string ProductTitle,
    decimal UnitPrice,
    int Quantity,
    decimal Subtotal
);

public record OrderResponse(
    int Id,
    DateTime OrderDate,
    string Status,
    decimal Total,
    string ShippingAddress,
    string ConfirmationNumber,
    List<OrderItemResponse> Items
);
