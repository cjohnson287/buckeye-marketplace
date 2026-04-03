namespace backend.DTOs;

public record CartItemDto(
    int Id,
    int ProductId,
    string Title,
    decimal Price,
    int Quantity,
    decimal Subtotal
);

public record CartDto(
    int Id,
    List<CartItemDto> Items,
    decimal Total
);

public record AddToCartRequest(
    int ProductId,
    int Quantity = 1
);

public record UpdateCartItemRequest(
    int Quantity
);
