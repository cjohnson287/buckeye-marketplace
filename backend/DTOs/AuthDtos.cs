using System.ComponentModel.DataAnnotations;

namespace backend.DTOs;

public record RegisterRequest(
    [Required, EmailAddress] string Email,
    [Required, MinLength(8)] string Password,
    [Required, MaxLength(100)] string DisplayName
);

public record LoginRequest(
    [Required, EmailAddress] string Email,
    [Required] string Password
);

public record AuthResponse(
    string Token,
    string Email,
    string DisplayName,
    string Role,
    DateTime ExpiresAtUtc
);
