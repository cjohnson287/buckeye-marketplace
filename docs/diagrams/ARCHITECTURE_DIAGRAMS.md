# System Architecture Diagram (Visual)

This diagram shows the three-tier architecture of Buckeye Marketplace.

```mermaid
graph TB
    subgraph "Client Tier - Frontend"
        A[React SPA<br/>Tailwind CSS]
        A1[Public Pages<br/>Catalog, Browse, Product Details]
        A2[User Portal<br/>Cart, Wishlist, Reviews]
        A3[Admin Portal<br/>Dashboard, Inventory, Orders]
        A --> A1
        A --> A2
        A --> A3
    end
    
    subgraph "Application Tier - Backend"
        B[Node.js + Express API Server]
        B1[Auth Routes<br/>Login, Register, JWT]
        B2[Product Routes<br/>CRUD, Search, Filter]
        B3[Cart Routes<br/>Add, Remove, Update]
        B4[Review Routes<br/>Create, Moderate]
        B5[Admin Routes<br/>Inventory, Orders]
        B6[Middleware<br/>JWT Verify, RBAC, Logging]
        
        B --> B1
        B --> B2
        B --> B3
        B --> B4
        B --> B5
        B --> B6
    end
    
    subgraph "Data Tier - Database"
        C[PostgreSQL Database]
        C1[Users Table]
        C2[Products Table]
        C3[Orders Table]
        C4[Reviews Table]
        C5[Cart Table]
        C6[Product Images Table]
        
        C --> C1
        C --> C2
        C --> C3
        C --> C4
        C --> C5
        C --> C6
    end
    
    subgraph "External Services"
        D[AWS S3 / Cloudinary<br/>Image Storage]
        E[Stripe<br/>Payment Processing<br/>Future Phase]
        F[SendGrid / AWS SES<br/>Email Service<br/>Future Phase]
    end
    
    A -->|HTTPS REST API<br/>JSON| B
    B -->|SQL Queries<br/>via ORM| C
    B -->|Upload/Retrieve Images| D
    B -.->|Future: Process Payments| E
    B -.->|Future: Send Emails| F
    
    style A fill:#61dafb,stroke:#333,stroke-width:2px,color:#000
    style B fill:#68a063,stroke:#333,stroke-width:2px,color:#fff
    style C fill:#336791,stroke:#333,stroke-width:2px,color:#fff
    style D fill:#ff9900,stroke:#333,stroke-width:2px,color:#000
    style E fill:#635bff,stroke:#333,stroke-width:2px,color:#fff
    style F fill:#1a82e2,stroke:#333,stroke-width:2px,color:#fff
```

## Data Flow Diagram

```mermaid
sequenceDiagram
    participant Alex as Alex (Customer)
    participant React as React Frontend
    participant Express as Express Backend
    participant DB as PostgreSQL
    participant S3 as AWS S3

    Note over Alex,S3: Example: Customer Browsing Products
    
    Alex->>React: Opens website
    React->>React: Component mounts
    React->>Express: GET /api/products?category=clothing
    Express->>Express: Validate request
    Express->>DB: SELECT * FROM products WHERE category='clothing'
    DB-->>Express: Return product rows
    Express->>S3: Get image URLs
    S3-->>Express: Return URLs
    Express-->>React: JSON response with products
    React-->>Alex: Display product grid

    Note over Alex,S3: Example: Admin Adding Product
    
    Alex->>React: Login as Jordan (admin)
    React->>Express: POST /api/auth/login
    Express->>DB: SELECT * FROM users WHERE email=?
    DB-->>Express: Return user data
    Express-->>React: JWT token
    React->>React: Store JWT in memory
    
    React->>Express: POST /api/admin/products<br/>(with JWT + form data)
    Express->>Express: Verify JWT
    Express->>Express: Check admin role
    Express->>S3: Upload product images
    S3-->>Express: Return image URLs
    Express->>DB: BEGIN TRANSACTION<br/>INSERT INTO products<br/>INSERT INTO product_images<br/>COMMIT
    DB-->>Express: Success
    Express-->>React: New product created
    React-->>Alex: Success message + updated inventory
```

## Component Interaction Diagram

```mermaid
graph LR
    subgraph "Frontend Components"
        PC[Product Catalog]
        PD[Product Detail]
        SC[Shopping Cart]
        RV[Reviews]
        AD[Admin Dashboard]
    end
    
    subgraph "Backend API Endpoints"
        PE[/api/products]
        CE[/api/cart]
        RE[/api/reviews]
        AE[/api/admin/*]
        UE[/api/auth/*]
    end
    
    subgraph "Database Tables"
        PT[(Products)]
        CT[(Cart)]
        RT[(Reviews)]
        UT[(Users)]
        OT[(Orders)]
    end
    
    PC -->|GET| PE
    PD -->|GET by ID| PE
    SC -->|POST/PUT/DELETE| CE
    RV -->|POST/GET| RE
    AD -->|CRUD| AE
    
    PE --> PT
    CE --> CT
    RE --> RT
    AE --> PT
    AE --> OT
    UE --> UT
    
    style PC fill:#61dafb,stroke:#333
    style PD fill:#61dafb,stroke:#333
    style SC fill:#61dafb,stroke:#333
    style RV fill:#61dafb,stroke:#333
    style AD fill:#ff6b6b,stroke:#333
    
    style PE fill:#68a063,stroke:#333
    style CE fill:#68a063,stroke:#333
    style RE fill:#68a063,stroke:#333
    style AE fill:#ff6b6b,stroke:#333
    style UE fill:#68a063,stroke:#333
    
    style PT fill:#336791,stroke:#333
    style CT fill:#336791,stroke:#333
    style RT fill:#336791,stroke:#333
    style UT fill:#336791,stroke:#333
    style OT fill:#336791,stroke:#333
```

## Deployment Architecture

```mermaid
graph TB
    subgraph "Production Environment"
        subgraph "Frontend Hosting - Vercel/Netlify"
            FE[React App<br/>Static Build]
            CDN[CDN Distribution]
            FE --> CDN
        end
        
        subgraph "Backend Hosting - Render/Railway"
            BE[Node.js API Server]
            LB[Load Balancer]
            BE1[Instance 1]
            BE2[Instance 2]
            
            BE --> LB
            LB --> BE1
            LB --> BE2
        end
        
        subgraph "Database Hosting - Supabase/RDS"
            DB[(PostgreSQL Database)]
            DBR[(Read Replica)]
            DB -.->|Replication| DBR
        end
        
        subgraph "Storage - AWS"
            S3[S3 Bucket<br/>Product Images]
            CF[CloudFront CDN]
            S3 --> CF
        end
    end
    
    User[Customer/Admin] -->|HTTPS| CDN
    CDN -->|API Calls| LB
    BE1 -->|Read/Write| DB
    BE2 -->|Read/Write| DB
    BE1 -->|Read Only| DBR
    BE2 -->|Read Only| DBR
    BE1 -->|Upload/Fetch| S3
    BE2 -->|Upload/Fetch| S3
    
    style User fill:#FFE66D,stroke:#333,stroke-width:3px
    style FE fill:#61dafb,stroke:#333,stroke-width:2px
    style BE fill:#68a063,stroke:#333,stroke-width:2px
    style BE1 fill:#68a063,stroke:#333
    style BE2 fill:#68a063,stroke:#333
    style DB fill:#336791,stroke:#333,stroke-width:2px,color:#fff
    style S3 fill:#ff9900,stroke:#333,stroke-width:2px
```

## Legend

- **Blue (React)**: Frontend components and UI
- **Green (Node.js)**: Backend API and business logic
- **Dark Blue (PostgreSQL)**: Database and data storage
- **Orange (AWS)**: External cloud services
- **Purple**: Payment services (future)
- **Light Blue**: Email services (future)
- **Red**: Admin-specific components/routes

## How to View

1. **In GitHub**: This diagram will render automatically when viewing the markdown file
2. **In VS Code**: Install "Markdown Preview Mermaid Support" extension
3. **Online**: Copy the mermaid code to https://mermaid.live

## Diagram Source Files

Save these diagrams in your documentation:
- `docs/diagrams/architecture.mermaid` - System architecture
- `docs/diagrams/dataflow.mermaid` - Data flow sequences  
- `docs/diagrams/deployment.mermaid` - Deployment architecture

