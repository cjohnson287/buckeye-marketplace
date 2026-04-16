# CHANGELOG

## 2026-04-15 — Milestone 5

### Added
- JWT authentication with ASP.NET Core Identity (`/api/auth/register`, `/api/auth/login`)
- Role-based authorization (User/Admin) and protected cart/order endpoints
- Order processing flow (`POST /api/orders`, `GET /api/orders/mine`)
- Admin order status update endpoint and product CRUD endpoints
- Frontend login/register/auth context/protected routes/logout
- Frontend order confirmation and order history pages
- Admin dashboard UI for product management and order status updates
- Backend tests (3 unit + 1 integration)
- Frontend tests (3 unit/component)
- Playwright E2E happy path spec

### Security Fixes
- Removed hardcoded user cart ownership; now claim-scoped by JWT subject
- Stored JWT key in user secrets instead of `appsettings.json`
- Enforced HTTPS redirection and added basic secure headers
