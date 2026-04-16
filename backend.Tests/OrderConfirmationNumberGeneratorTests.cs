using backend.Services;

namespace backend.Tests;

public class OrderConfirmationNumberGeneratorTests
{
    [Fact]
    public void Generate_ReturnsExpectedPrefixAndTimestamp()
    {
        var now = new DateTime(2026, 4, 15, 12, 30, 45, DateTimeKind.Utc);

        var confirmation = OrderConfirmationNumberGenerator.Generate(now);

        Assert.StartsWith("ORD-20260415123045-", confirmation);
        Assert.Equal(25, confirmation.Length);
    }
}
