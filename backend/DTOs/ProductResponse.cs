namespace backend.DTOs;

public record ProductResponse(
    int Id,
    string Title,
    string Description,
    decimal Price,
    string Category,
    string SellerName,
    string? ImageUrl,
    DateTime PostedDate
);
