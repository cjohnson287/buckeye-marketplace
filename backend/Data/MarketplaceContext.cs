using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Data;

public class MarketplaceContext : DbContext
{
    public MarketplaceContext(DbContextOptions<MarketplaceContext> options)
        : base(options) { }

    public DbSet<Product> Products { get; set; }
    public DbSet<Category> Categories { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Category>().HasData(
            new Category { Id = 1, Name = "Vinyl" },
            new Category { Id = 2, Name = "Clothing" },
            new Category { Id = 3, Name = "CD" },
            new Category { Id = 4, Name = "Video Game" }
        );

        modelBuilder.Entity<Product>().HasData(
            new Product
            {
                Id = 1,
                Title = "The Smiths - The Queen is Dead",
                Description = "Classic vinyl record featuring iconic tracks from the legendary 1980s band.",
                Price = 34.99m,
                CategoryId = 1,
                SellerName = "Vinyl Collector Mike",
                ImageUrl = "https://placehold.co/400x300?text=The+Smiths",
                PostedDate = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc)
            },
            new Product
            {
                Id = 2,
                Title = "Vintage Smashing Pumpkins: Gish Tour Tee 1991",
                Description = "Authentic vintage tour t-shirt from the 1991 Gish tour. Pre-owned collectible in great condition.",
                Price = 89.99m,
                CategoryId = 2,
                SellerName = "Retro Threads Sarah",
                ImageUrl = "https://placehold.co/400x300?text=Pumpkins+Tee",
                PostedDate = new DateTime(2026, 1, 2, 0, 0, 0, DateTimeKind.Utc)
            },
            new Product
            {
                Id = 3,
                Title = "Bjork - Debut CD",
                Description = "CD album featuring Bjork's breakthrough solo debut with experimental pop sounds.",
                Price = 14.99m,
                CategoryId = 3,
                SellerName = "Music Expert Alex",
                ImageUrl = "https://placehold.co/400x300?text=Bjork+Debut",
                PostedDate = new DateTime(2026, 1, 3, 0, 0, 0, DateTimeKind.Utc)
            },
            new Product
            {
                Id = 4,
                Title = "Silent Hill 2 2001 PS2",
                Description = "Original PS2 game disc. One of the greatest survival horror games ever made. Disc in excellent condition.",
                Price = 129.99m,
                CategoryId = 4,
                SellerName = "Gaming Nostalgia Jordan",
                ImageUrl = "https://placehold.co/400x300?text=Silent+Hill+2",
                PostedDate = new DateTime(2026, 1, 4, 0, 0, 0, DateTimeKind.Utc)
            },
            new Product
            {
                Id = 5,
                Title = "Malice Mizer - Merveilles CD",
                Description = "CD album from the influential Japanese gothic rock band. Limited edition pressing.",
                Price = 24.99m,
                CategoryId = 3,
                SellerName = "CD Enthusiast Taylor",
                ImageUrl = "https://placehold.co/400x300?text=Malice+Mizer",
                PostedDate = new DateTime(2026, 1, 5, 0, 0, 0, DateTimeKind.Utc)
            },
            new Product
            {
                Id = 6,
                Title = "The Cure - Wish",
                Description = "Vinyl record of The Cure's album Wish. High-quality pressing in pristine condition.",
                Price = 39.99m,
                CategoryId = 1,
                SellerName = "Vinyl Collector Mike",
                ImageUrl = "https://placehold.co/400x300?text=The+Cure+Wish",
                PostedDate = new DateTime(2026, 1, 6, 0, 0, 0, DateTimeKind.Utc)
            },
            new Product
            {
                Id = 7,
                Title = "Prince - Purple Rain",
                Description = "Iconic vinyl record from Prince's legendary Purple Rain album and motion picture.",
                Price = 44.99m,
                CategoryId = 1,
                SellerName = "Record Store Owner Chris",
                ImageUrl = "https://placehold.co/400x300?text=Prince+Purple",
                PostedDate = new DateTime(2026, 1, 7, 0, 0, 0, DateTimeKind.Utc)
            },
            new Product
            {
                Id = 8,
                Title = "Vintage Phantom of The Opera Tee",
                Description = "Vintage graphic t-shirt from Phantom of The Opera theatrical production. Classic collectible.",
                Price = 49.99m,
                CategoryId = 2,
                SellerName = "Retro Threads Sarah",
                ImageUrl = "https://placehold.co/400x300?text=Phantom+Opera",
                PostedDate = new DateTime(2026, 1, 8, 0, 0, 0, DateTimeKind.Utc)
            }
        );
    }
}
