# Buckeye Marketplace - AI Agent Instructions

## Milestone 3: Product Catalog — Vertical Slice 1

**Points:** 25 | **Due:** Friday, March 6 by 11:59 PM

### Scope
Build a complete vertical slice: users can visit the marketplace, see a list of products, and click into any product to see full details. Data flows from the browser, through the .NET API, using an in-memory data store (hardcoded C# list).

## Project Overview
Buckeye Marketplace is a full-stack e-commerce application built with:
- **Frontend:** React + TypeScript (Vite) with React Router
- **Backend:** .NET Web API (InMemory data store for M3, EF Core in M4+)
- **Database:** In-memory list of products for this milestone

## Architecture
- Frontend runs on http://localhost:5173
- Backend runs on https://localhost:5001
- API base path: /api/

### M3 API Endpoints
- `GET /api/products` — returns all products as JSON array (HTTP 200)
- `GET /api/products/{id}` — returns single product by ID (HTTP 200) or 404 if not found

## Frontend: M3 Requirements

### Components (Must-Have)
1. **ProductList** — renders grid/list of ProductCard components; shows loading state while fetching
2. **ProductCard** — displays: title, price, category, seller name; clickable to view details
3. **ProductDetail** — shows all required fields for a single product; navigation back to list works

### Required Product Fields (in all components)
- `id` — unique identifier
- `title` — product name
- `description` — seller's description
- `price` — listed price (number)
- `category` — e.g., Textbooks, Electronics, Furniture, Clothing
- `sellerName` — display name of the seller
- `postedDate` — when the listing was created (ISO string)
- `imageUrl` — product image URL (placeholder acceptable)

### Data & State
- **No hardcoded product data** in components
- All data fetched from `GET /api/products` and `GET /api/products/{id}`
- Handle loading state while API call is in progress
- Handle empty state if no products returned
- Handle error state if API fails

### Routing
- React Router v6 for navigation
- `/products` — Product List Page (shows all products)
- `/products/:id` — Product Detail Page (shows single product details)
- Navigation works both ways: list → detail, detail → list

## Frontend Conventions
- Components live in `src/components/`
- Each component has its own folder: `ComponentName/ComponentName.tsx` + `ComponentName.module.css`
- Pages live in `src/pages/`
- API calls go in `src/api/` as separate functions
- Types/interfaces go in `src/types/`
- CSS Modules for styling (not inline styles, not global CSS)

## Code Style
- Functional components only (no class components)
- TypeScript strict mode — all props must be typed
- Destructure props in function signature
- Use `interface` for props and object shapes; use `type` for unions and intersections
- Named exports for components, default export for pages

## Backend: M3 Requirements

### ProductsController (Must-Have)
Create `ProductsController.cs` with exactly 2 endpoints:

1. **GET /api/products**
   - Returns HTTP 200 with JSON array of all products
   - Response format: array of Product objects with all required fields

2. **GET /api/products/{id}**
   - Returns HTTP 200 with single product (JSON object) if found
   - Returns HTTP 404 if product ID does not exist
   - Response format: Product object with all required fields

### Product C# Model
Define a `Product` class with these properties:
- `Id` (int)
- `Title` (string)
- `Description` (string)
- `Price` (decimal)
- `Category` (string)
- `SellerName` (string)
- `PostedDate` (DateTime)
- `ImageUrl` (string, nullable)

### In-Memory Data Store
- Create a **private static list** of Product objects in the controller (or as a static helper)
- Minimum **8 products** across at least **3 categories**
- Sample categories: Textbooks, Electronics, Furniture, Clothing
- Use realistic product names, prices, and seller names
- Use placeholder image URLs (e.g., from picsum.photos)

### CORS Configuration
- Enable CORS for `http://localhost:5173` (React dev server)
- Allow GET requests (minimum; POST not needed for M3)

## Current State
- Product catalog: M3 (ACTIVE)
- Product detail page: M3 (ACTIVE)
- Shopping cart: M4 (future)
- Authentication: M5 (future)

## When Generating Code
- Always include TypeScript types
- Always include aria-labels on interactive elements
- Use CSS Modules (*.module.css), not inline styles
- **Always handle loading and error states for API calls**
- **Always use useState + useEffect for data fetching**
- **Never hardcode product data in components**
- Follow the existing project folder structure

## AI Tool Usage Documentation

For this milestone, you should document how you used AI tools (GitHub Copilot, Claude, etc.).

In your GitHub commits and/or README, include:
1. **What you asked AI to help with** (e.g., "helped scaffold ProductsController", "generated sample product data")
2. **The actual prompt(s) you used** (copy-paste the prompt you sent)
3. **What you accepted vs. modified vs. rejected** from AI output (show your judgment)
4. **Where you relied on your own understanding** instead of accepting AI suggestions

Example:
```
Used Claude to scaffold ProductsController:
- Prompt: "Create a ProductsController in ASP.NET Core with two GET endpoints..."
- Accepted: The controller structure and HTTP status codes
- Modified: Changed in-memory data from a field to a static method; renamed Category to match our domain
- Rejected: Suggested async/await pattern (not needed for static data in M3)
```

Remember: **AI is a productivity aid. You are still responsible for understanding and verifying everything you submit.**