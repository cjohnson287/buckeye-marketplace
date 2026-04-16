namespace backend.Services;

public static class OrderConfirmationNumberGenerator
{
    public static string Generate(DateTime utcNow)
    {
        return $"ORD-{utcNow:yyyyMMddHHmmss}-{Guid.NewGuid().ToString("N")[..6].ToUpperInvariant()}";
    }
}
