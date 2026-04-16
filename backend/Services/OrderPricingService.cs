namespace backend.Services;

public static class OrderPricingService
{
    public static decimal CalculateTotal(IEnumerable<decimal> subtotals)
    {
        return subtotals.Sum();
    }
}
