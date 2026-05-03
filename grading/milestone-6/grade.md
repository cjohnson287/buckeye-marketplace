# Lab Evaluation Report

**Student Repository**: `cjohnson287-buckeye-marketplace`
**Date**: May 3, 2026
**Rubric**: `grading/milestone-6/rubric.md`

## 0. Build & Run Status

| Component           | Build | Runs | Notes                                                                                                                                                                                                                                        |
| ------------------- | ----- | ---- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Backend (.NET)      | ✅    | ✅   | `dotnet build` succeeded (0 warnings). Server runs on port 5228, seeded entities to in-memory store.                                                                                                                                         |
| Frontend (React/TS) | ✅    | ✅   | `npm run build` succeeded (tsc + vite). Dev server runs on port 5173.                                                                                                                                                                        |
| Backend Tests       | —     | ✅   | 8/8 tests passed (`dotnet test`).                                                                                                                                                                                                            |
| Frontend Tests      | —     | ✅   | 6/6 tests passed (`vitest --run`).                                                                                                                                                                                                           |
| API Endpoints       | —     | ✅   | GET /api/products → 200 (8 products); GET /api/products/1 → 200; GET /api/products/999 → 404; GET /api/cart (no auth) → 401; GET /api/cart (auth) → 200; POST /api/auth/register → 201 (JWT returned); GET /api/orders (regular user) → 403. |

## 1. Project Structure

| Expected                         | Found                                                                                                  | Status |
| -------------------------------- | ------------------------------------------------------------------------------------------------------ | ------ |
| `.github/workflows/` (CI/CD)     | `.github/workflows/deploy-backend.yml`, `.github/workflows/deploy-frontend.yml`                        | ✅     |
| `docs/SYSTEM_ARCHITECTURE.md`    | `docs/SYSTEM_ARCHITECTURE.md`                                                                          | ✅     |
| `docs/DATABASE_SCHEMA.md`        | `docs/DATABASE_SCHEMA.md`                                                                              | ✅     |
| `docs/COMPONENT_ARCHITECTURE.md` | `docs/COMPONENT_ARCHITECTURE.md`                                                                       | ✅     |
| `docs/FEATURE_PRIORITIZATION.md` | `docs/FEATURE_PRIORITIZATION.md`                                                                       | ✅     |
| `docs/adr/` (ADRs)               | `docs/adr/001-technology-stack.md`, `docs/adr/002-deployment-strategy.md`                              | ✅     |
| `docs/diagrams/`                 | `docs/diagrams/ARCHITECTURE_DIAGRAMS.md`                                                               | ✅     |
| Backend test project             | `backend.Tests/` (4 test files, 8 tests)                                                               | ✅     |
| Frontend tests                   | `src/reducers/authReducer.test.ts`, `src/pages/LoginPage.test.tsx`, `src/utils/authValidation.test.ts` | ✅     |
| E2E test                         | `frontend/e2e/checkout.spec.ts`                                                                        | ✅     |
| AI Reflection                    | `M6_AI_Reflection.md`                                                                                  | ✅     |
| Testing & QA doc                 | `M6_Testing_QA.md`                                                                                     | ✅     |
| User/Admin Guide                 | `M6_User_Admin_Guide.md`                                                                               | ✅     |
| CHANGELOG with M6 entry          | `CHANGELOG.md` — only contains M5 entry                                                                | ❌     |
| v1.0 tag                         | Not found in CHANGELOG or submission                                                                   | ❌     |

## 2. Rubric Scorecard

| #   | Requirement           | Points | Score | Status     | Evidence                                                                                                                                                                                                                                                                                                                                                                                                          |
| --- | --------------------- | ------ | ----- | ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Production Deployment | 5      | 4     | ✅ Good    | Azure App Service for both frontend (`buckeye-frontend-final-ryon287`) and backend (`buckeye-api-final-ryon287`). HTTPS via Azure. Security headers in [Program.cs](backend/Program.cs#L104-L108). GitHub Actions deploy workflows present. CORS config in source only allows `localhost:5173` — production origin not in code. No v1.0 tag or M6 CHANGELOG entry.                                                |
| 2   | CI/CD Pipeline        | 4      | 3.5   | ✅ Good    | [deploy-backend.yml](.github/workflows/deploy-backend.yml) — build, test, publish, deploy with path filters. [deploy-frontend.yml](.github/workflows/deploy-frontend.yml) — build with production `VITE_API_URL`, deploy. Uses GitHub Secrets for Azure publish profiles. Minor: no PR gate/check workflow, no lint step.                                                                                         |
| 3   | Testing & QA          | 4      | 3     | ✅ Good    | 8 backend tests (3 unit + 1 integration), 6 frontend tests (unit + component), 1 Playwright E2E spec. All passing. [M6_Testing_QA.md](M6_Testing_QA.md) documents user/admin flows, cross-browser, responsiveness, and bugs found. Test case "Actual Result" column is generic ("tested") rather than specific observed behavior.                                                                                 |
| 4   | Technical Docs        | 5      | 2.5   | ⚠️ Partial | Six documentation files plus diagrams exist and are well-organized. **Critical issue**: all docs describe a Node.js/Express/PostgreSQL (PERN) stack — the actual project uses .NET/ASP.NET Core/InMemory DB. ADR 001 selects PERN stack; ADR 002 selects Vercel/Render/Supabase; actual deployment is Azure App Service. Docs are structurally comprehensive but factually inaccurate for the implemented system. |
| 5   | User Docs             | 4      | 2.5   | ⚠️ Partial | [M6_User_Admin_Guide.md](M6_User_Admin_Guide.md) covers 5 user flows and 2 admin flows with numbered steps. No screenshots included (document explicitly lists them as a TODO: "Screenshots to Include in Final PDF"). Steps are very generic (e.g., "Navigate to the account, register, or login area").                                                                                                         |
| 6   | AI Reflection         | 3      | 2.5   | ✅ Good    | [M6_AI_Reflection.md](M6_AI_Reflection.md) — covers tools used (Copilot, Claude, ChatGPT), usage across 6 SDLC phases with example prompts, what worked/didn't, productivity impact, and lessons learned. Deployment debugging section is insightful. Could benefit from more specific code-level before/after examples.                                                                                          |

**Total: 18 / 25**

## 3. Detailed Findings

### Item #4: Technical Docs

**What was expected**: Comprehensive technical documentation that accurately describes the system architecture, database schema, component architecture, ADRs, and diagrams for the implemented system.

**What was found**: Six well-organized documentation files exist in `docs/`:

- [SYSTEM_ARCHITECTURE.md](docs/SYSTEM_ARCHITECTURE.md) — describes Node.js/Express backend (L40: "Node.js / Express Backend"), not the actual ASP.NET Core backend
- [DATABASE_SCHEMA.md](docs/DATABASE_SCHEMA.md) — describes PostgreSQL tables; actual system uses EF Core InMemoryDatabase
- [COMPONENT_ARCHITECTURE.md](docs/COMPONENT_ARCHITECTURE.md) — describes Tailwind CSS components; actual frontend uses CSS Modules
- [ADR 001](docs/adr/001-technology-stack.md) — selects "PERN stack" (L30); actual project is .NET + React
- [ADR 002](docs/adr/002-deployment-strategy.md) — selects Vercel/Render/Supabase; actual deployment is Azure App Service
- [ARCHITECTURE_DIAGRAMS.md](docs/diagrams/ARCHITECTURE_DIAGRAMS.md) — Mermaid diagrams label backend as "Node.js + Express API Server"

**Gap**: All technical documentation describes a completely different technology stack than what was implemented. The documents appear to be from Milestone 2 planning and were never updated to reflect the actual .NET/C#/Azure implementation. The conceptual architecture patterns (three-tier, REST API, JWT auth) are valid, but the technology-specific details are wrong throughout.

### Item #5: User Docs

**What was expected**: Professional user guide with screenshots covering user and admin workflows.

**What was found**: [M6_User_Admin_Guide.md](M6_User_Admin_Guide.md) contains 7 sections with numbered step lists. Steps are generic and lack specificity (e.g., "Click the add-to-cart option" without identifying which button or page element). The document ends with a "Screenshots to Include in Final PDF" section listing 7 required screenshots — none are present.

**Gap**: No screenshots are included. Steps lack the specificity needed for a user to follow them independently (no navigation paths, no UI element descriptions, no expected results after each step).

## 4. Action Plan

1. **[5pts] Technical Docs**: Update all documentation to reflect the actual implementation:
   - `SYSTEM_ARCHITECTURE.md`: Replace Node.js/Express references with ASP.NET Core/.NET; update middleware, route, and service descriptions to match `Program.cs` and controllers
   - `DATABASE_SCHEMA.md`: Update to reflect the actual EF Core models (`Product.cs`, `ApplicationUser.cs`, `Cart.cs`, `Order.cs`, etc.)
   - `COMPONENT_ARCHITECTURE.md`: Update to describe actual React components with CSS Modules (not Tailwind)
   - `ADR 001`: Rewrite to document the .NET + React stack decision
   - `ADR 002`: Rewrite to document Azure App Service deployment decision
   - `ARCHITECTURE_DIAGRAMS.md`: Update all Mermaid diagrams to show .NET backend and Azure deployment

2. **[4pts] User Docs**: Add screenshots to the user guide and make steps specific:
   - Capture screenshots of each page mentioned in the "Screenshots to Include" section
   - Rewrite steps with specific UI element names, navigation paths (e.g., "Click the 'Login' link in the top navigation bar"), and expected outcomes

## 5. Code Quality Coaching (Non-Scoring)

- **CORS production origin missing**: [Program.cs](backend/Program.cs#L84-L90) — `WithOrigins("http://localhost:5173")` only allows the dev server. The production frontend URL (`https://buckeye-frontend-final-ryon287.azurewebsites.net`) should be added as an allowed origin, ideally driven by configuration. If CORS is configured at the Azure portal level instead, the code should still reflect this for maintainability and local-to-prod parity.

- **CHANGELOG not updated for M6**: [CHANGELOG.md](CHANGELOG.md) only has an M5 entry. Each milestone should have its own dated entry documenting what was added, changed, or fixed.

- **InMemory database in production**: [Program.cs](backend/Program.cs#L18-L19) uses `UseInMemoryDatabase("MarketplaceDb")` — this means all data is lost on restart. The testing doc references Azure SQL Database, but the code doesn't conditionally switch to a real database for production. Consider using environment-based configuration to select the database provider.

- **Seeded admin password strength**: [Program.cs](backend/Program.cs#L135) — `Admin1234` meets minimum requirements but is weak for a production system. Consider using a stronger password or environment variable for seeded admin credentials.

## 6. Git Practices Coaching (Non-Scoring)

- **Missing v1.0 release tag**: The rubric submission guidelines call for tagging the final code as `v1.0`. This tag was not found. Using semantic versioning and release tags is standard professional practice for marking deployment milestones.

- **CHANGELOG maintenance**: The CHANGELOG only covers Milestone 5. Keeping the CHANGELOG updated with each milestone demonstrates incremental progress and is essential for project history.

---

**18/25** — Good deployment infrastructure and CI/CD automation; solid testing coverage with all tests passing. The primary gaps are in documentation: technical docs describe a different tech stack (Node.js/PERN) than what was built (.NET/Azure), and the user guide lacks screenshots and specificity. The AI reflection is thoughtful and well-structured. The coaching notes above (CORS production config, CHANGELOG maintenance, InMemory DB in production, release tagging) are suggestions for professional growth, not scoring deductions.
