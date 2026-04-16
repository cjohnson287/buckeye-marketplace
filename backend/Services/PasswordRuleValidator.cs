using System.Text.RegularExpressions;

namespace backend.Services;

public static partial class PasswordRuleValidator
{
    public static bool IsValid(string password)
    {
        if (string.IsNullOrWhiteSpace(password) || password.Length < 8)
        {
            return false;
        }

        return ContainsUppercase().IsMatch(password)
               && ContainsDigit().IsMatch(password);
    }

    [GeneratedRegex("[A-Z]")]
    private static partial Regex ContainsUppercase();

    [GeneratedRegex("[0-9]")]
    private static partial Regex ContainsDigit();
}
