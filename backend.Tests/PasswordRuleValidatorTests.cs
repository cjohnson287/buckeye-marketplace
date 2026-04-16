using backend.Services;

namespace backend.Tests;

public class PasswordRuleValidatorTests
{
    [Theory]
    [InlineData("short1A", false)]
    [InlineData("alllowercase1", false)]
    [InlineData("NO_DIGITS_HERE", false)]
    [InlineData("ValidPass1", true)]
    public void IsValid_ReturnsExpectedResult(string password, bool expected)
    {
        var actual = PasswordRuleValidator.IsValid(password);

        Assert.Equal(expected, actual);
    }
}
