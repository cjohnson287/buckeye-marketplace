# ADR 001: Technology Stack Selection

**Status**: Accepted  
**Date**: 2026-02-15  
**Deciders**: Development Team  
**AI Tool Used**: Claude (Anthropic) for research and analysis

---

## Context

Buckeye Marketplace is a vintage clothing and music e-commerce platform serving two primary personas:
- **Alex Martinez** (Buyer): College student seeking authentic vintage items
- **Jordan Lee** (Admin): Store owner managing inventory and curating products

We need to select a technology stack that:
1. Supports rapid development within a semester timeline
2. Provides a modern, responsive user experience
3. Enables secure authentication and role-based access control
4. Scales to handle product catalog browsing and transactions
5. Demonstrates understanding of full-stack web development concepts

---

## Decision

We will use the **PERN stack** with the following technologies:

### Frontend
- **React.js** (v18+) - JavaScript UI library
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing

### Backend
- **Node.js** (v18+) - JavaScript runtime
- **Express.js** - Web application framework
- **JWT** (jsonwebtoken) - Authentication

### Database
- **PostgreSQL** (v14+) - Relational database
- **Sequelize** or **Prisma** - ORM (to be decided in implementation)

### Additional Tools
- **AWS S3** or **Cloudinary** - Image storage
- **bcrypt** - Password hashing
- **Axios** - HTTP client
- **dotenv** - Environment configuration

---

## Alternatives Considered

### Alternative 1: MERN Stack (MongoDB instead of PostgreSQL)

**Pros**:
- NoSQL flexibility for varying product attributes
- Popular in bootcamps and tutorials
- JSON-native (matches JavaScript objects)

**Cons**:
- Less suitable for relational data (products ↔ orders ↔ users)
- No ACID guarantees (critical for e-commerce transactions)
- Weaker support for complex queries (filtering by multiple criteria)
- Alex's pain point: "unclear descriptions" → Need structured data model

**Why Rejected**: E-commerce systems have inherently relational data (orders contain products, users place orders, products have reviews). PostgreSQL's foreign keys and transactions are more appropriate.

---

### Alternative 2: Django (Python) + React

**Pros**:
- Django admin panel out-of-the-box (good for Jordan's needs)
- Strong ORM (Django ORM)
- Built-in authentication

**Cons**:
- Two languages (Python backend, JavaScript frontend) → more context switching
- Heavier framework (more opinionated, slower development for small project)
- Class-based views harder to learn than Express routes

**Why Rejected**: JavaScript full-stack (Node + React) allows single language, faster learning curve, lighter weight for project scope.

---

### Alternative 3: Ruby on Rails + React

**Pros**:
- Convention over configuration (rapid development)
- Mature e-commerce gems (Spree, Solidus)

**Cons**:
- Learning curve for Ruby syntax
- Less industry demand than JavaScript
- Heavier framework for project scope

**Why Rejected**: JavaScript is more versatile for future career prospects; Rails is overkill for semester project.

---

### Alternative 4: Next.js (Full-stack React)

**Pros**:
- Server-side rendering (better SEO)
- API routes in same codebase
- Built-in routing

**Cons**:
- Blurs frontend/backend separation (harder to demonstrate understanding)
- More complex deployment
- Overkill for SPA needs

**Why Rejected**: Clear separation of frontend/backend is pedagogically valuable for demonstrating API design.

---

## Rationale

### Why React?

**User Experience Needs**:
- **Alex's Behavior**: "Browses extensively, uses filters" → Need fast, dynamic UI without page reloads
- **Jordan's Need**: "Admin dashboard, inventory management tools" → Rich UI for CRUD operations

**Technical Benefits**:
- Component-based architecture → Reusable UI elements (buttons, cards, forms)
- Virtual DOM → Fast re-renders when filtering products
- Huge ecosystem → Libraries for carousels, forms, date pickers
- Industry standard → Strong career relevance

**AI Research Findings** (via Claude):
- React has 40%+ market share in frontend frameworks (Stack Overflow Survey 2024)
- 200k+ questions on Stack Overflow → easy to find help
- Used by major e-commerce platforms (Shopify, Walmart, Airbnb)

---

### Why Tailwind CSS?

**Development Speed**:
- Utility-first → No writing custom CSS files
- Responsive design → Built-in breakpoints (sm:, md:, lg:)
- Consistency → Predefined spacing, colors, typography

**User Needs**:
- **Alex's Pain Point**: "Poor photos" → Need polished, modern design to build trust
- **Journey Stage - Discover**: Professional appearance to convey legitimacy

**Alternative Considered**: Bootstrap
- **Why Rejected**: Bootstrap sites look generic; Tailwind allows more custom designs while maintaining speed

---

### Why Node.js + Express?

**Full-Stack JavaScript**:
- Same language for frontend and backend → Easier context switching
- JSON native → No transformation between JavaScript objects and API responses
- npm ecosystem → Massive library of packages

**RESTful API Design**:
- Express is minimal and unopinionated → Clear demonstration of API architecture
- Middleware pattern → Easy to add authentication, logging, validation
- Fast development → Less boilerplate than Django, Rails

**Performance**:
- Event-driven, non-blocking I/O → Good for I/O-heavy operations (database queries, image uploads)
- Efficient for read-heavy workloads (browsing products)

**AI Research Findings** (via Claude):
- Node.js used by Netflix, LinkedIn, Uber for scalability
- Express has 10M+ weekly npm downloads
- Well-documented authentication patterns (Passport.js, JWT)

---

### Why PostgreSQL?

**Relational Data Model**:
- Products have categories, users place orders, orders contain products → Natural relational structure
- Foreign keys enforce data integrity (can't have order item without product)
- ACID compliance → Critical for financial transactions (orders, payments)

**Complex Queries**:
- **US-02**: Search & Filter Products → Need to filter by brand AND era AND condition
- SQL's WHERE clauses are more efficient than MongoDB aggregations for this

**Data Integrity**:
- **Jordan's Need**: "Ensure listing accuracy" → Constraints prevent invalid data
- Check constraints: price > 0, rating between 1-5
- Unique constraints: can't have duplicate emails

**Scalability**:
- Proven at scale (Instagram uses PostgreSQL for 500M+ users)
- Excellent indexing for fast queries
- Read replicas for scaling read-heavy workloads (product browsing)

**AI Research Findings** (via Claude):
- PostgreSQL ranked #1 for data integrity in DB-Engines
- JSON support (JSONB) gives NoSQL flexibility when needed
- Better for OLTP (transactional) workloads vs MongoDB (better for OLAP/analytics)

---

### Why JWT for Authentication?

**Stateless Authentication**:
- No session storage needed on server → Easier to scale horizontally
- Token contains user ID and role → No database lookup on every request

**Mobile-Ready**:
- Future-proof if we add mobile app
- Works identically for web and mobile clients

**Security**:
- Tokens expire (1 hour default) → Limits damage if stolen
- Signed with secret → Can't be tampered with

**Alternative Considered**: Session-based authentication (cookies)
- **Why Rejected**: JWT is more modern, API-friendly, and scalable

---

### Why AWS S3 / Cloudinary?

**Image Storage**:
- **Jordan's Frustration**: "Managing product images and condition data"
- **Alex's Pain Point**: "Poor photos" → Need high-quality, fast-loading images

**Benefits**:
- Offload image storage from application server
- CDN distribution → Images load faster globally
- Image transformations (resize, optimize) handled by service
- Cheaper than storing in database as BLOBs

**S3 vs Cloudinary**:
- **S3**: Lower cost, more control, requires more setup
- **Cloudinary**: Easier setup, built-in transformations, free tier

**Decision**: Start with **Cloudinary** for rapid development, migrate to S3 if needed

---

## Consequences

### Positive

1. **Single Language**: JavaScript everywhere reduces context switching
2. **Fast Development**: React + Express + Tailwind → Rapid prototyping
3. **Industry Relevance**: PERN stack is in high demand (job market)
4. **Clear Architecture**: Separation of frontend/backend demonstrates API design
5. **Scalability**: PostgreSQL + JWT → Can scale horizontally
6. **Strong Ecosystem**: npm + React ecosystem → Easy to add features (image carousels, forms, date pickers)

### Negative

1. **JavaScript Quirks**: Type safety issues (mitigated with TypeScript if time permits)
2. **Callback Hell**: Async code can be complex (mitigated with async/await)
3. **Security Responsibility**: More manual security work than Rails/Django (mitigated with libraries like helmet.js)

### Neutral

1. **Learning Curve**: Moderate for both frontend and backend (acceptable for semester project)
2. **Deployment**: Need separate hosting for frontend (Vercel) and backend (Render) vs monolithic deployment

---

## Validation Against User Needs

| User Need | Technology Support |
|-----------|-------------------|
| Alex: "Browse extensively, use filters" | React SPA + PostgreSQL indexed queries |
| Alex: "Poor photos" → Need good images | Cloudinary image optimization + React image components |
| Alex: "Trust in vintage retailers" | PostgreSQL reviews + JWT authentication |
| Jordan: "Admin dashboard" | React admin portal with RBAC |
| Jordan: "Manage inventory efficiently" | Express REST API + PostgreSQL CRUD |
| Jordan: "Managing product images" | Cloudinary upload + product images table |

---

## Implementation Notes

### Development Environment Setup
```bash
# Backend
npm init -y
npm install express pg sequelize bcrypt jsonwebtoken dotenv cors

# Frontend
npx create-react-app buckeye-marketplace-frontend
cd buckeye-marketplace-frontend
npm install react-router-dom axios tailwindcss
```

### Project Structure
```
buckeye-marketplace/
├── backend/
│   ├── server.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── products.js
│   │   ├── cart.js
│   │   └── admin.js
│   ├── models/
│   ├── middleware/
│   └── config/
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── services/
    │   └── utils/
    └── public/
```

---

## AI Tool Usage Documentation

**Tool**: Claude (Anthropic)  
**Version**: Claude Sonnet 4.5  
**Date**: February 15, 2026

### Prompts Used:

1. **Technology Research**:
   > "Compare MERN vs PERN stack for an e-commerce platform. Consider database query complexity, ACID compliance, and scalability."

2. **Framework Comparison**:
   > "Compare React vs Vue.js vs Angular for a college student building their first full-stack e-commerce app. Consider learning curve, ecosystem, and job market demand."

3. **Authentication Strategy**:
   > "Compare JWT vs session-based authentication for a React + Node.js e-commerce app. Consider scalability, security, and mobile readiness."

4. **Image Storage**:
   > "Compare AWS S3 vs Cloudinary vs storing images in PostgreSQL for a vintage clothing store. Consider cost, performance, and ease of use."

### AI Contributions:
- Researched current market share of frontend frameworks
- Analyzed pros/cons of different database systems
- Provided code examples for Express + React + PostgreSQL integration
- Suggested best practices for JWT implementation
- Identified performance optimization strategies (indexes, caching)

### Human Decisions:
- Final technology choices based on AI research + course requirements
- Prioritization aligned with semester timeline and learning goals
- Validation against user personas and journey maps from Milestone 1

---

**References**:
- [React Documentation](https://react.dev)
- [Express.js Documentation](https://expressjs.com)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [JWT Introduction](https://jwt.io/introduction)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

