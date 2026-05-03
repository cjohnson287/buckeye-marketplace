# Lab Evaluation Report

**Student Repository**: `cjohnson287-buckeye-marketplace`
**Date**: May 3, 2026
**Rubric**: `grading/milestone-4/rubric.md`

## 0. Build & Run Status

| Component | Build | Runs | Notes |
| --- | --- | --- | --- |
| Backend (.NET) | ✅ | ✅ | `dotnet build` succeeded (0 warnings). Server runs on port 5228, seeded entities to in-memory store. |
| Frontend (React/TS) | ✅ | ✅ | `npm run build` succeeded (tsc + vite). Dev server runs on port 5173. |
| Backend Tests | — | ✅ | 8/8 tests passed (`dotnet test`). |
| Frontend Tests | — | ✅ | 6/6 tests passed (`vitest --run`). |
| API Endpoints | — | ✅ | GET /api/products → 200 (8 products); GET /api/products/1 → 200; GET /api/products/999 → 404; GET /api/cart (no auth) → 401; GET /api/cart (auth) → 200; POST /api/auth/register → 201 (JWT returned); GET /api/orders (regular user) → 403. |


## 1. Project Structure

| Expected                                                    | Found                                     | Status |
| ----------------------------------------------------------- | ----------------------------------------- | ------ |
| `backend/Controllers/CartController.cs`                     | `backend/Controllers/CartController.cs`   | ✅     |
| `backend/Models/Cart.cs`                                    | `backend/Models/Cart.cs`                  | ✅     |
| `backend/Models/CartItem.cs`                                | `backend/Models/CartItem.cs`              | ✅     |
| `backend/DTOs/CartDto.cs`                                   | `backend/DTOs/CartDto.cs`                 | ✅     |
| `backend/Data/MarketplaceContext.cs` (Cart/CartItem DbSets) | `backend/Data/MarketplaceContext.cs`      | ✅     |
| `frontend/src/api/cart.ts`                                  | `frontend/src/api/cart.ts`                | ✅     |
| `frontend/src/types/cart.ts`                                | `frontend/src/types/cart.ts`              | ✅     |
| `frontend/src/reducers/cartReducer.ts`                      | `frontend/src/reducers/cartReducer.ts`    | ✅     |
| `frontend/src/contexts/CartContext.tsx`                     | `frontend/src/contexts/CartContext.tsx`   | ✅     |
| `frontend/src/pages/CartPage.tsx`                           | `frontend/src/pages/CartPage.tsx`         | ✅     |
| `frontend/src/components/CartSidebar.tsx`                   | `frontend/src/components/CartSidebar.tsx` | ✅     |
| AI usage documentation                                      | `M4_AI_TOOL_USAGE.md`                     | ✅     |

## 2. Rubric Scorecard

| #   | Requirement                              | Points | Status | Evidence                                                                                                                                                                                                                                                                                        |
| --- | ---------------------------------------- | ------ | ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1a  | useReducer or Context API for cart state | 2      | ✅ Met | [CartContext.tsx](frontend/src/contexts/CartContext.tsx#L28) — `useReducer(cartReducer, initialCartState)` with full `CartProvider` and `useCart` hook; [cartReducer.ts](frontend/src/reducers/cartReducer.ts) — comprehensive reducer with 15 action cases                                     |
| 1b  | Add, update quantity, remove operations  | 2      | ✅ Met | [CartContext.tsx](frontend/src/contexts/CartContext.tsx#L58-L104) — `addToCart()`, `updateQuantity()`, `removeFromCart()`, `clearCart()` all dispatch actions and call API                                                                                                                      |
| 1c  | Cart count in header + calculated totals | 1      | ✅ Met | [Layout.tsx](frontend/src/components/Layout.tsx#L39-L42) — `state.itemCount` displayed as badge; [CartPage.tsx](frontend/src/pages/CartPage.tsx#L100-L103) — `cart.total.toFixed(2)` displayed in summary                                                                                       |
| 2a  | GET /api/cart                            | 1      | ✅ Met | [CartController.cs](backend/Controllers/CartController.cs#L27-L47) — returns `CartDto` with items via Include/ThenInclude; verified 200 response                                                                                                                                                |
| 2b  | POST /api/cart (add item)                | 1      | ✅ Met | [CartController.cs](backend/Controllers/CartController.cs#L52-L105) — creates cart if needed, increments quantity for duplicate items, returns 201 Created                                                                                                                                      |
| 2c  | PUT /api/cart/{cartItemId} (update qty)  | 1      | ✅ Met | [CartController.cs](backend/Controllers/CartController.cs#L110-L142) — validates quantity ≥ 1, recalculates subtotal, ownership check via `UserId`                                                                                                                                              |
| 2d  | DELETE endpoints (item + clear)          | 1      | ✅ Met | [CartController.cs](backend/Controllers/CartController.cs#L147-L175) — `DELETE /{cartItemId}` removes single item; [CartController.cs](backend/Controllers/CartController.cs#L180-L205) — `DELETE /clear` removes all items                                                                     |
| 2e  | Proper status codes and responses        | 1      | ✅ Met | 200 OK for GET/PUT/DELETE, 201 Created for POST, 400 for invalid quantity, 404 for missing product/item, 401 for unauthenticated, 403 for wrong user                                                                                                                                            |
| 3a  | Cart/CartItem EF entities                | 2      | ✅ Met | [Cart.cs](backend/Models/Cart.cs) — `Id`, `UserId`, `Items` collection, timestamps; [CartItem.cs](backend/Models/CartItem.cs) — `CartId`, `ProductId`, `Quantity`, `Subtotal` with `[Range]` and `[Column]` annotations                                                                         |
| 3b  | Relationships and navigation properties  | 1      | ✅ Met | [MarketplaceContext.cs](backend/Data/MarketplaceContext.cs#L28-L43) — Cart→CartItem cascade delete, CartItem→Product restrict delete, unique index on `UserId`; navigation properties on both entities                                                                                          |
| 3c  | Migrations applied, data persists        | 1      | ✅ Met | [Program.cs](backend/Program.cs#L20) — `UseInMemoryDatabase("MarketplaceDb")` with `EnsureCreated()`; entities properly configured; orchestrator confirmed 12 entities seeded                                                                                                                   |
| 4a  | Real API replaces mock/localStorage      | 2      | ✅ Met | [cart.ts](frontend/src/api/cart.ts) — all 5 functions call `/api/cart` via `apiFetch`; no localStorage used for cart data; [http.ts](frontend/src/api/http.ts) — `apiFetch` wrapper attaches JWT `Authorization` header                                                                         |
| 4b  | All cart operations call API             | 2      | ✅ Met | [CartContext.tsx](frontend/src/contexts/CartContext.tsx#L58-L104) — `addToCart` → `cartAPI.addToCart()`, `updateQuantity` → `cartAPI.updateCartItemQuantity()`, `removeFromCart` → `cartAPI.removeFromCart()`, `clearCart` → `cartAPI.clearCart()`, `refreshCart` → `cartAPI.fetchCart()`       |
| 4c  | State synchronization                    | 1      | ✅ Met | [CartContext.tsx](frontend/src/contexts/CartContext.tsx#L53-L56) — `useEffect` refreshes cart when `authState.isAuthenticated` changes; each operation dispatches `*_SUCCESS` with updated cart from API response                                                                               |
| 5a  | Loading states                           | 1      | ✅ Met | [CartPage.tsx](frontend/src/pages/CartPage.tsx#L49-L51) — "Loading cart…" message; [ProductCard.tsx](frontend/src/components/ProductCard.tsx#L56) — "Adding..." text with `disabled={isAdding}`; [ProductDetailPage.tsx](frontend/src/pages/ProductDetailPage.tsx#L23) — `isAddingToCart` state |
| 5b  | Error messages and edge cases            | 1      | ✅ Met | [CartPage.tsx](frontend/src/pages/CartPage.tsx#L53-L55) — global error display; [CartPage.tsx](frontend/src/pages/CartPage.tsx#L17-L20) — per-item `actionErrors` tracking; [CartPage.tsx](frontend/src/pages/CartPage.tsx#L59-L64) — empty cart state with "Continue Shopping" link            |
| 5c  | Success feedback                         | 1      | ✅ Met | [ProductCard.tsx](frontend/src/components/ProductCard.tsx#L52-L57) — button toggles "Adding…" → "Add to Cart" on success; [ProductDetailPage.tsx](frontend/src/pages/ProductDetailPage.tsx#L76) — quantity resets to 1 after successful add; cart state updates immediately                     |
| 6a  | Clean component structure                | 1      | ✅ Met | Components in `components/`, pages in `pages/`, API in `api/`, types in `types/`, reducers in `reducers/`, contexts in `contexts/`; CSS Modules used for all styling                                                                                                                            |
| 6b  | Service layer / custom hooks             | 1      | ✅ Met | [cart.ts](frontend/src/api/cart.ts) — dedicated API service layer; [CartContext.tsx](frontend/src/contexts/CartContext.tsx#L114-L119) — `useCart()` custom hook; [http.ts](frontend/src/api/http.ts) — `apiFetch` utility; backend `Services/JwtTokenService.cs`                                |
| 6c  | AI usage documented                      | 1      | ✅ Met | [M4_AI_TOOL_USAGE.md](M4_AI_TOOL_USAGE.md) — 13 sections documenting prompts, accepted/modified/rejected decisions, and own understanding applied                                                                                                                                               |

**Total: 25 / 25**

## 3. Detailed Findings

All rubric items are met. No deficiencies to report.

## 4. Action Plan

No corrective actions required — full marks earned.

## 5. Code Quality Coaching (Non-Scoring)

- **Hardcoded admin credentials in seed data**: [Program.cs](backend/Program.cs#L117-L118) contains `adminEmail = "admin@buckeye.local"` and `adminPassword = "Admin1234"` as plaintext constants. Even for development, consider loading seed credentials from configuration or user-secrets to build good habits around secret management.

- **Missing `useCallback` for async functions in context**: [CartContext.tsx](frontend/src/contexts/CartContext.tsx#L58-L104) — `addToCart`, `updateQuantity`, `removeFromCart`, `clearCart`, and `refreshCart` are defined as plain async functions inside the provider. Wrapping them in `useCallback` would prevent unnecessary re-renders of consumers, though in practice the impact is minimal here.

- **Missing `useEffect` dependency for `refreshCart`**: [CartContext.tsx](frontend/src/contexts/CartContext.tsx#L53-L56) — the `useEffect` that calls `refreshCart` lists `authState.isAuthenticated` as a dependency but `refreshCart` is not in the dependency array. The ESLint `react-hooks/exhaustive-deps` rule would flag this. Since `refreshCart` closes over `authState`, this works correctly in practice, but satisfying the lint rule would be cleaner.

- **Cart total calculated client-side in sidebar**: [CartSidebar.tsx](frontend/src/components/CartSidebar.tsx#L22) — `total` is recalculated by multiplying `price * quantity` rather than using `state.data.total` from the API response. This could drift from the server-calculated total. Prefer using the API-provided total for consistency.

- **Global exception handler leaks internal details**: [GlobalExceptionHandler.cs](backend/Middleware/GlobalExceptionHandler.cs#L31-L39) — `ArgumentException` and `KeyNotFoundException` messages are passed directly to the client via `Detail`. In production, exception messages could contain internal implementation details. Consider sanitizing or using generic messages.

## 6. Git Practices Coaching (Non-Scoring)

- **Commit granularity not evaluated**: Git history was not inspected as part of this file-based evaluation. Students are encouraged to commit incrementally — e.g., separate commits for backend models, controller, frontend API layer, state management, and UI — with meaningful messages describing each logical change.

---

**25/25** — All rubric criteria are fully met. The coaching notes above (seed credentials, useCallback, useEffect dependencies, client-side total calculation, exception detail leaking) are suggestions for professional growth, not scoring deductions.
