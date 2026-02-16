# System Architecture
**Buckeye Marketplace - Vintage Clothing & Music Store**

## Architecture Overview

Buckeye Marketplace follows a modern three-tier web application architecture with clear separation of concerns. This architecture was chosen to support the needs identified in our user research while maintaining scalability, security, and maintainability.

---

## High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT TIER                              │
│  ┌────────────────────────────────────────────────────────┐    │
│  │           React Single Page Application (SPA)           │    │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │    │
│  │  │ Public Pages │  │ User Portal  │  │ Admin Portal │ │    │
│  │  │              │  │              │  │              │ │    │
│  │  │ • Catalog    │  │ • Cart       │  │ • Dashboard  │ │    │
│  │  │ • Product    │  │ • Wishlist   │  │ • Inventory  │ │    │
│  │  │ • Browse     │  │ • Reviews    │  │ • Orders     │ │    │
│  │  │ • Auth Pages │  │ • Profile    │  │ • Moderation │ │    │
│  │  └──────────────┘  └──────────────┘  └──────────────┘ │    │
│  │                                                          │    │
│  │         Component Libraries: React, Tailwind CSS        │    │
│  │         State Management: React Context / Redux         │    │
│  └────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTPS / REST API
                              │ JSON Data Exchange
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      APPLICATION TIER                            │
│  ┌────────────────────────────────────────────────────────┐    │
│  │              Node.js / Express Backend                  │    │
│  │  ┌──────────────────────────────────────────────────┐  │    │
│  │  │              RESTful API Routes                   │  │    │
│  │  │                                                    │  │    │
│  │  │  ┌─────────────┐  ┌─────────────┐  ┌──────────┐ │  │    │
│  │  │  │   Product   │  │    Auth     │  │  Admin   │ │  │    │
│  │  │  │   Routes    │  │   Routes    │  │  Routes  │ │  │    │
│  │  │  └─────────────┘  └─────────────┘  └──────────┘ │  │    │
│  │  │  ┌─────────────┐  ┌─────────────┐  ┌──────────┐ │  │    │
│  │  │  │    Cart     │  │   Review    │  │  Order   │ │  │    │
│  │  │  │   Routes    │  │   Routes    │  │  Routes  │ │  │    │
│  │  │  └─────────────┘  └─────────────┘  └──────────┘ │  │    │
│  │  └──────────────────────────────────────────────────┘  │    │
│  │                                                          │    │
│  │  ┌──────────────────────────────────────────────────┐  │    │
│  │  │            Business Logic Layer                   │  │    │
│  │  │  • Authentication & Authorization (JWT)           │  │    │
│  │  │  • Input Validation & Sanitization                │  │    │
│  │  │  • Business Rules Enforcement                     │  │    │
│  │  │  • Data Transformation                            │  │    │
│  │  └──────────────────────────────────────────────────┘  │    │
│  │                                                          │    │
│  │  ┌──────────────────────────────────────────────────┐  │    │
│  │  │              Middleware Layer                     │  │    │
│  │  │  • JWT Authentication                             │  │    │
│  │  │  • Role-based Access Control (RBAC)              │  │    │
│  │  │  • Request Logging                                │  │    │
│  │  │  • Error Handling                                 │  │    │
│  │  │  • CORS Configuration                             │  │    │
│  │  └──────────────────────────────────────────────────┘  │    │
│  └────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ Database Queries
                              │ SQL / ORM
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         DATA TIER                                │
│  ┌────────────────────────────────────────────────────────┐    │
│  │              PostgreSQL Database                        │    │
│  │  ┌──────────────────────────────────────────────────┐  │    │
│  │  │              Core Tables                          │  │    │
│  │  │                                                    │  │    │
│  │  │  • Users (customers & admins)                     │  │    │
│  │  │  • Products (clothing & music inventory)          │  │    │
│  │  │  • Categories                                     │  │    │
│  │  │  • Orders                                         │  │    │
│  │  │  • OrderItems                                     │  │    │
│  │  │  • Reviews                                        │  │    │
│  │  │  • CartItems                                      │  │    │
│  │  │  • Wishlist                                       │  │    │
│  │  │  • ProductImages                                  │  │    │
│  │  └──────────────────────────────────────────────────┘  │    │
│  └────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    EXTERNAL SERVICES                             │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────┐  │
│  │  Cloud Storage   │  │  Payment Gateway │  │ Email Service│  │
│  │  (AWS S3 or      │  │  (Stripe)        │  │ (SendGrid /  │  │
│  │  Cloudinary)     │  │  [Future Phase]  │  │  AWS SES)    │  │
│  │                  │  │                  │  │ [Future]     │  │
│  │  • Product imgs  │  │  • Checkout      │  │ • Order conf │  │
│  │  • User uploads  │  │  • Refunds       │  │ • Receipts   │  │
│  └──────────────────┘  └──────────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                      DEPLOYMENT PLATFORM                         │
│                        (AWS / Render)                            │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────┐  │
│  │  Frontend        │  │  Backend         │  │  Database    │  │
│  │  (Vercel /       │  │  (Render /       │  │  (RDS /      │  │
│  │  Netlify)        │  │  Railway)        │  │  Supabase)   │  │
│  └──────────────────┘  └──────────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Component Descriptions

### Client Tier (Frontend)

**Technology**: React.js with Tailwind CSS

**Purpose**: Provides the user interface for both customers and administrators

**User Needs Addressed**:
- **Alex's Need**: "Browse extensively, use filters, read reviews" → Rich, interactive UI
- **Jordan's Need**: "Admin dashboard, inventory management tools" → Separate admin interface
- **Journey Stage - Discover**: Attractive landing page to build initial trust
- **Journey Stage - Browse**: Efficient product catalog with filtering
- **Journey Stage - Evaluate**: Detailed product pages with condition info
- **Journey Stage - Purchase**: Streamlined cart and checkout experience

**Key Features**:
- **Public Pages**: Unauthenticated users can browse catalog, view products
- **User Portal**: Authenticated customers access cart, wishlist, reviews
- **Admin Portal**: Admins manage inventory, moderate content, view orders

**Why React**:
- Component-based architecture aligns with Atomic Design principles
- Large ecosystem of libraries for e-commerce features
- Excellent performance with virtual DOM
- Strong community support and documentation
- Ideal for single-page applications with dynamic content

---

### Application Tier (Backend)

**Technology**: Node.js with Express.js framework

**Purpose**: Business logic, API endpoints, authentication, and data management

**User Needs Addressed**:
- **Security**: JWT authentication protects user accounts and admin functions
- **Data Validation**: Ensures data integrity for product listings (Jordan's need)
- **Authorization**: Role-based access control separates customer/admin capabilities
- **API Structure**: RESTful endpoints for predictable, scalable data access

**Key Features**:

1. **RESTful API Routes**:
   - `POST /api/auth/register` - User registration
   - `POST /api/auth/login` - User authentication
   - `GET /api/products` - Fetch product catalog
   - `GET /api/products/:id` - Get product details
   - `POST /api/cart` - Add to cart
   - `POST /api/reviews` - Submit review
   - `POST /api/admin/products` - Create product (admin only)
   - `PUT /api/admin/products/:id` - Update product (admin only)
   - `DELETE /api/admin/reviews/:id` - Moderate reviews (admin only)

2. **Business Logic Layer**:
   - Product availability checking
   - Price calculations
   - Inventory tracking
   - Order processing rules
   - Review validation and scoring

3. **Middleware**:
   - JWT verification for protected routes
   - Role checking (admin vs customer)
   - Request validation
   - Error handling and logging
   - CORS for frontend-backend communication

**Why Node.js + Express**:
- JavaScript everywhere (same language as frontend)
- Excellent for I/O-intensive operations (product browsing)
- Fast development with minimal boilerplate
- Large npm ecosystem for authentication, validation, etc.
- Well-suited for RESTful APIs

---

### Data Tier (Database)

**Technology**: PostgreSQL (relational database)

**Purpose**: Persistent storage for users, products, orders, and reviews

**User Needs Addressed**:
- **Alex's Need**: "Find authentic vintage items" → Reliable product data storage
- **Jordan's Need**: "Keep inventory accurate" → ACID compliance, data integrity
- **Journey Pain Point**: "Is this authentic and worth it?" → Reviews stored permanently
- **Scalability**: Efficient queries for filtering and search

**Key Data Entities**:
- **Users**: Customer accounts, admin accounts
- **Products**: Vintage clothing and music items with metadata
- **Categories**: Clothing types, music genres
- **Orders**: Purchase history
- **Reviews**: Customer feedback and ratings
- **Cart**: Temporary item storage per user
- **Wishlist**: Saved items per user
- **ProductImages**: Multiple photos per product

**Why PostgreSQL**:
- **ACID Compliance**: Critical for e-commerce (order integrity)
- **Relational Model**: Natural fit for product-order-user relationships
- **Complex Queries**: Supports filtering, search, aggregations for reviews
- **Data Integrity**: Foreign keys ensure referential integrity
- **JSON Support**: Flexibility for semi-structured data (product attributes)
- **Scalability**: Proven at scale for e-commerce applications
- **Open Source**: No licensing fees, strong community

---

### External Services

**Cloud Storage (AWS S3 or Cloudinary)**
- **Purpose**: Store product images uploaded by Jordan
- **User Need**: Alex needs multiple, high-quality photos to evaluate condition
- **Rationale**: Offload static asset storage from application server
- **Choice Factor**: Better performance, CDN distribution, specialized image handling

**Payment Gateway (Stripe) - Future Phase**
- **Purpose**: Process payments securely
- **User Need**: Alex's journey stage "Purchase" requires secure checkout
- **Note**: Deferred to future phase; MVP may use "cash on pickup" or manual invoicing

**Email Service (SendGrid / AWS SES) - Future Phase**
- **Purpose**: Order confirmations, shipping updates
- **User Need**: Post-purchase communication
- **Note**: Deferred to future phase; MVP may use manual email

---

## Data Flow Examples

### Example 1: Customer Browses Product Catalog

```
1. Alex opens website
   → React app loads from CDN

2. React component mounts, calls API
   → GET /api/products?category=clothing&condition=like-new

3. Express route handler receives request
   → Validates query parameters
   → Calls database service

4. PostgreSQL executes query
   → SELECT * FROM products WHERE category = 'clothing' AND condition = 'like-new'
   → Returns result rows

5. Express transforms data
   → Maps database rows to API response format
   → Includes product image URLs from S3

6. React receives JSON response
   → Updates component state
   → Renders product grid to UI

7. Alex sees filtered product catalog
   → Can click product for details
```

**User Journey Mapping**: Browse stage → "Do they have my style/size?"

---

### Example 2: Jordan Adds New Product (Admin)

```
1. Jordan logs into admin dashboard
   → React admin portal loads
   → JWT token stored in browser

2. Jordan fills product form and uploads images
   → Name, description, price, category, condition, photos

3. React submits form data
   → POST /api/admin/products
   → Includes JWT token in Authorization header
   → Includes image files

4. Express middleware chain executes
   a. JWT verification → Validates token
   b. Role check → Confirms user is admin
   c. Input validation → Checks required fields

5. Business logic processes request
   a. Uploads images to S3
   b. Gets back S3 URLs
   c. Prepares database insertion

6. PostgreSQL transaction
   a. INSERT INTO products (name, description, price, ...)
   b. INSERT INTO product_images (product_id, url, ...)
   c. COMMIT transaction

7. Express returns success response
   → Includes new product ID and details

8. React updates admin dashboard
   → Shows success message
   → New product appears in inventory list
```

**User Journey Mapping**: Addresses Jordan's frustration with manual inventory management

---

### Example 3: Alex Adds Review After Purchase

```
1. Alex writes review on product page
   → Rating (1-5 stars)
   → Comment text

2. React submits review
   → POST /api/reviews
   → Includes JWT token (must be logged in)
   → Body: { productId, rating, comment }

3. Express middleware
   → JWT verification (must be authenticated)
   → Validation (rating 1-5, comment not empty)

4. Business logic
   → Checks if user purchased this product (prevent fake reviews)
   → Calculates new average rating for product

5. PostgreSQL transaction
   a. INSERT INTO reviews (user_id, product_id, rating, comment, created_at)
   b. UPDATE products SET avg_rating = (SELECT AVG(rating) FROM reviews WHERE product_id = ?)
   c. COMMIT

6. Express returns success
   → Review ID and timestamp

7. React updates product page
   → Shows new review in list
   → Updates average rating display
```

**User Journey Mapping**: Post-purchase stage → "Would I shop here again?" + addresses Alex's pain point about trust

---

## Architecture Decisions and Rationale

### Decision 1: Single Page Application (SPA) vs Server-Side Rendering (SSR)

**Choice**: SPA with React

**Rationale**:
- **User Experience**: Smooth, app-like experience for Alex's browsing behavior
- **Admin Dashboard**: Rich interactions for Jordan's inventory management
- **Simplicity**: Separates frontend/backend concerns cleanly
- **Course Alignment**: Allows clear demonstration of REST API design

**Trade-offs**:
- SEO: Less optimal than SSR (can add meta tags and pre-rendering later)
- Initial Load: Slightly slower first page load (acceptable for project scope)

---

### Decision 2: Monolithic Backend vs Microservices

**Choice**: Monolithic Express application

**Rationale**:
- **Scope**: Project size doesn't warrant microservices complexity
- **Development Speed**: Faster to build and deploy single application
- **Course Context**: Easier to demonstrate and grade
- **Team Size**: Solo developer project

**Future Path**: Could split into microservices if scaling requires it (product service, order service, etc.)

---

### Decision 3: PostgreSQL vs MongoDB

**Choice**: PostgreSQL (relational)

**Rationale**:
- **Data Structure**: Products, orders, users have clear relationships
- **ACID Properties**: Critical for order processing and inventory management
- **Query Complexity**: Filtering products requires complex joins and aggregations
- **Data Integrity**: Foreign keys prevent orphaned data (order items without products)
- **Course Alignment**: Demonstrates understanding of relational database design

**When MongoDB Would Make Sense**:
- Highly variable product attributes (but our vintage items have consistent structure)
- Massive scale requiring horizontal sharding (not needed for project)

---

### Decision 4: JWT vs Session-Based Authentication

**Choice**: JWT (JSON Web Tokens)

**Rationale**:
- **Stateless**: Server doesn't need to store session data
- **Scalability**: Easy to scale horizontally (no session store needed)
- **Mobile-Ready**: Tokens work well for potential future mobile app
- **API-First**: Natural fit for REST API architecture

**Trade-offs**:
- **Revocation**: Harder to immediately invalidate tokens (acceptable for project scope)
- **Token Size**: Slightly larger than session IDs (negligible impact)

---

### Decision 5: Cloud Hosting Platform

**Choice**: Frontend (Vercel/Netlify) + Backend (Render/Railway) + Database (Supabase/RDS)

**Rationale**:
- **Separation of Concerns**: Frontend and backend can be deployed independently
- **Free Tiers**: All platforms offer generous free tiers for student projects
- **Ease of Use**: Simple deployment process (Git push to deploy)
- **Auto-Scaling**: Platforms handle traffic spikes automatically
- **Course Requirements**: Meets "cloud deployment" requirement

**Alternative Considered**: Full AWS deployment (more complex, overkill for project scope)

---

## Security Considerations

### Authentication & Authorization
- JWT tokens with expiration
- Password hashing with bcrypt
- Role-based access control (RBAC)
- Admin routes protected by middleware

### Data Protection
- HTTPS for all communications
- SQL injection prevention via parameterized queries (ORM)
- XSS prevention via React's built-in escaping
- CORS configuration to allow only frontend domain

### Input Validation
- Frontend validation for UX
- Backend validation for security (never trust client)
- Sanitization of user inputs (reviews, product descriptions)

---

## Scalability Considerations

### Current Architecture Supports:
- **Vertical Scaling**: Upgrade server resources as needed
- **Horizontal Scaling**: Add more backend instances behind load balancer
- **Database Scaling**: PostgreSQL read replicas for read-heavy operations
- **CDN**: Static assets (images) served from S3/Cloudinary

### Bottleneck Analysis:
1. **Database Queries**: Product search/filter could slow with large catalogs
   - **Solution**: Add indexes on frequently queried columns (category, condition, price)
2. **Image Uploads**: Large files could slow backend
   - **Solution**: Direct upload to S3 from frontend (pre-signed URLs)
3. **Review Aggregation**: Calculating average ratings on every query
   - **Solution**: Cache average in products table, update on review submission

---

## Technology Stack Summary

| Layer | Technology | Justification |
|-------|-----------|---------------|
| **Frontend** | React.js | Component-based, large ecosystem, great UX |
| **Styling** | Tailwind CSS | Rapid UI development, consistent design system |
| **Backend** | Node.js + Express | JavaScript full-stack, fast development, RESTful APIs |
| **Database** | PostgreSQL | ACID compliance, relational data, complex queries |
| **Auth** | JWT | Stateless, scalable, API-friendly |
| **Image Storage** | AWS S3 / Cloudinary | Offload static assets, CDN, image optimization |
| **Deployment** | Vercel + Render + Supabase | Easy deployment, free tiers, auto-scaling |
| **Version Control** | Git + GitHub | Industry standard, required for course |

---

## Alignment with User Research

### Alex Martinez (Buyer) Needs → Architecture Support

| User Need | Architecture Feature |
|-----------|---------------------|
| Browse extensively | React SPA with fast client-side navigation |
| Use filters | Indexed PostgreSQL queries for efficient filtering |
| Read reviews | Reviews table with user_id foreign key |
| Trust authenticity | User authentication, verified purchases only can review |
| Clear condition info | Structured condition field in products table |
| Multiple photos | ProductImages table, S3 image storage |

### Jordan Lee (Admin) Needs → Architecture Support

| User Need | Architecture Feature |
|-----------|---------------------|
| Admin dashboard | Separate React admin portal |
| Manage inventory | CRUD API endpoints for products |
| Moderate reviews | Admin-only DELETE endpoints for reviews |
| Upload images | Multi-part form upload to S3 |
| Track stock status | Inventory count field in products table |
| Efficient updates | RESTful API for quick product edits |

---

## Next Steps for Implementation

1. **Milestone 3**: Set up project structure
   - Initialize React app
   - Set up Express server
   - Configure PostgreSQL database
   - Implement authentication

2. **Milestone 4**: Build core features
   - Product catalog API and UI
   - Admin CRUD operations
   - Shopping cart functionality

3. **Milestone 5**: Polish and deploy
   - Reviews and ratings
   - Search and filtering
   - Cloud deployment
   - Testing and bug fixes

---

**AI Tool Usage**: This architecture was designed using Claude AI to analyze user personas, journey maps, and feature requirements. AI helped identify technical decisions that best support user needs while maintaining industry best practices for scalability, security, and maintainability.
