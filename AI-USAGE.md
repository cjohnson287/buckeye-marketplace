# AI-USAGE

## Tooling
Used GitHub Copilot (GPT-5.3-Codex) to accelerate Milestone 5 implementation.

## What AI helped with
1. Scaffolding Identity + JWT setup in ASP.NET Core.
2. Building auth/order DTOs, controllers, and protected route structure.
3. Generating frontend auth context, login/register pages, and route guards.
4. Creating starter unit/integration tests and Playwright E2E spec.

## Example prompts
- "Add ASP.NET Core Identity and JWT auth to this API with register/login endpoints and role-based authorization."
- "Implement order placement from cart and user-scoped order history endpoint from JWT claims."
- "Add React auth context with token storage and protected routes for checkout/orders/admin."
- "Generate Vitest tests for auth reducer, auth validation helper, and login form empty-submit error."

## Accepted vs Modified vs Rejected
- Accepted: base controller/service scaffolds, test templates.
- Modified: claim-scoped authorization checks, cart clearing behavior after order placement, and admin dashboard UX.
- Rejected: insecure suggestions that relied on query user IDs or hardcoded secrets.

## Human judgment points
- Verified every protected endpoint uses JWT claims, not URL user IDs.
- Chose user-secrets for JWT signing key and documented submission credentials.
- Manually validated security and testing requirements alignment with the rubric.
