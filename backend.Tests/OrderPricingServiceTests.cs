using backend.Services;

namespace backend.Tests;

public class OrderPricingServiceTests
{
    [Fact]
    public void CalculateTotal_SumsAllSubtotals()
    {
        var subtotals = new[] { 19.99m, 40.00m, 0.01m };

        var total = OrderPricingService.CalculateTotal(subtotals);

        Assert.Equal(60.00m, total);
    }
}
