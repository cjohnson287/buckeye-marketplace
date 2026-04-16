using System.ComponentModel.DataAnnotations;

namespace backend.DTOs;

public record CreateProductRequest(
    [Required, MaxLength(200)] string Title,
    [MaxLength(2000)] string Description,
    [Range(0.01, 999999.99)] decimal Price,
    [Required] int CategoryId,
    [Required, MaxLength(100)] string SellerName,
    [Url] string? ImageUrl
);

public record UpdateProductRequest(
    [Required, MaxLength(200)] string Title,
    [MaxLength(2000)] string Description,
    [Range(0.01, 999999.99)] decimal Price,
    [Required] int CategoryId,
    [Required, MaxLength(100)] string SellerName,
    [Url] string? ImageUrl
);
