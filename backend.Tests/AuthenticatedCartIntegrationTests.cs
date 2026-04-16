using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using backend.Data;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;

namespace backend.Tests;

public class AuthenticatedCartIntegrationTests : IClassFixture<CustomWebApplicationFactory>
{
    private readonly CustomWebApplicationFactory _factory;

    public AuthenticatedCartIntegrationTests(CustomWebApplicationFactory factory)
    {
        _factory = factory;
    }

    [Fact]
    public async Task CartEndpoint_ReturnsCreated_WhenAuthenticated()
    {
        var client = _factory.CreateClient();

        var registerRequest = new
        {
            email = $"tester-{Guid.NewGuid():N}@buckeye.local",
            password = "Student123",
            displayName = "Integration Tester"
        };

        var registerResponse = await client.PostAsJsonAsync("/api/auth/register", registerRequest);
        Assert.Equal(HttpStatusCode.Created, registerResponse.StatusCode);

        var loginResponse = await client.PostAsJsonAsync("/api/auth/login", new
        {
            email = registerRequest.email,
            password = registerRequest.password
        });

        Assert.Equal(HttpStatusCode.OK, loginResponse.StatusCode);

        var authPayload = await loginResponse.Content.ReadFromJsonAsync<AuthResponse>();
        Assert.NotNull(authPayload);

        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", authPayload!.Token);

        var addResponse = await client.PostAsJsonAsync("/api/cart", new { productId = 1, quantity = 2 });
        Assert.Equal(HttpStatusCode.Created, addResponse.StatusCode);

        var cartResponse = await client.GetAsync("/api/cart");
        Assert.Equal(HttpStatusCode.OK, cartResponse.StatusCode);
    }

    private sealed record AuthResponse(string Token);
}

public class CustomWebApplicationFactory : WebApplicationFactory<Program>
{
    private readonly string _databaseName = $"MarketplaceDbTests-{Guid.NewGuid():N}";

    protected override void ConfigureWebHost(Microsoft.AspNetCore.Hosting.IWebHostBuilder builder)
    {
        builder.UseEnvironment("Testing");

        builder.ConfigureAppConfiguration((_, configBuilder) =>
        {
            configBuilder.AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["Jwt:Key"] = "Integration_Test_Signing_Key_2026_AtLeast32Chars",
                ["Jwt:Issuer"] = "buckeye-marketplace-api",
                ["Jwt:Audience"] = "buckeye-marketplace-client",
                ["Jwt:ExpiryMinutes"] = "60"
            });
        });

        builder.ConfigureServices(services =>
        {
            services.RemoveAll(typeof(DbContextOptions<MarketplaceContext>));
            services.AddDbContext<MarketplaceContext>(options =>
            {
                options.UseInMemoryDatabase(_databaseName);
            });
        });
    }
}
