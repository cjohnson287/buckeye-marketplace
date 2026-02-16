# Feature Prioritization
**Buckeye Marketplace - Vintage Clothing & Music Store**

## Prioritization Framework

Features are prioritized using MoSCoW method aligned with MVP launch strategy:
- **Must Have**: Core features needed for launch (Milestone 3-4)
- **Should Have**: Important but can wait until post-launch (Milestone 5)
- **Could Have**: Nice-to-haves for future iterations
- **Won't Have**: Out of scope for this semester

## Prioritization Criteria
1. **User Impact**: Does it solve critical pain points from journey map?
2. **Technical Dependency**: Is it required for other features?
3. **Persona Needs**: Which personas does it serve (Alex/Jordan)?
4. **Launch Readiness**: Can we launch without it?

---

## MUST HAVE - Sprint 1 (MVP Launch Features)

### 1. Product Catalog ⭐ HIGHEST PRIORITY
**Priority Level**: Must Have  
**Personas Served**: Alex Martinez (Buyer), Jordan Lee (Admin)  
**User Stories**: US-01, US-03

**Rationale**:
- **Alex's Pain Point**: "Unclear descriptions, poor photos" → Need rich product display
- **Jordan's Pain Point**: Manual inventory management → Need efficient catalog system
- Foundation for all other features; nothing works without products to display

**Technical Dependencies**: Required by Shopping Cart, Reviews, Search

**Launch Blocker**: YES - Can't sell without products

---

### 2. User Registration & Login (Authentication)
**Priority Level**: Must Have  
**Personas Served**: Alex Martinez, Jordan Lee  
**User Stories**: US-05

**Rationale**:
- **Alex's Pain Point**: "Lack of trust in vintage retailers" → Account = accountability
- **Jordan's Need**: Admin access control for inventory management
- Required for cart persistence, reviews, admin dashboard

**Technical Dependencies**: Required by Shopping Cart, Reviews, Admin Dashboard, Wishlist

**Launch Blocker**: YES - Need to differentiate admin from customers

---

### 3. Shopping Cart
**Priority Level**: Must Have  
**Personas Served**: Alex Martinez (Buyer)  
**User Stories**: US-04

**Rationale**:
- **Journey Stage**: Purchase → "Hope checkout is easy"
- Core e-commerce functionality; users expect to add items and checkout
- Vintage items are often one-of-a-kind, need cart to reserve/track

**Technical Dependencies**: Requires Product Catalog, Authentication

**Launch Blocker**: YES - Can't complete purchases without cart

---

### 4. Admin Dashboard
**Priority Level**: Must Have  
**Personas Served**: Jordan Lee (Admin)  
**User Stories**: US-08

**Rationale**:
- **Jordan's Frustration**: "Manual updates, managing product images"
- **Jordan's Need**: "Admin dashboard, inventory management tools"
- Can't launch without ability to add/manage products
- Jordan needs to update stock, add new items, manage listings

**Technical Dependencies**: Requires Authentication, Product Catalog

**Launch Blocker**: YES - Jordan can't operate the business without this

---

### 5. Cloud Deployment
**Priority Level**: Must Have  
**Personas Served**: All users  
**User Stories**: N/A (Infrastructure)

**Rationale**:
- **Journey Stage**: Discover → "Finds store via Google"
- Can't reach users without deployment
- Required for course completion and real-world testing

**Technical Dependencies**: Final step after all features implemented

**Launch Blocker**: YES - Not useful if only on localhost

---

## SHOULD HAVE - Sprint 2 (Post-Launch Enhancements)

### 6. Reviews and Ratings
**Priority Level**: Should Have  
**Personas Served**: Alex Martinez (Buyer)  
**User Stories**: US-07

**Rationale**:
- **Alex's Pain Point**: "Lack of trust in vintage retailers"
- **Journey Stage**: Post-Purchase → "Would I shop here again?"
- Builds trust and social proof
- Can launch without it, add after initial sales

**Technical Dependencies**: Requires Authentication, Product Catalog

**Launch Blocker**: NO - Can gather reviews after launch

**Why Not Must Have**: Store can function without reviews initially; Jordan's reputation can be conveyed through About page and product descriptions

---

### 7. Search & Filtering
**Priority Level**: Should Have  
**Personas Served**: Alex Martinez (Buyer)  
**User Stories**: US-02

**Rationale**:
- **Alex's Behavior**: "Browses extensively, uses filters"
- **Journey Stage**: Browse → "Do they have my style/size?"
- Critical for user experience but can browse manually at launch with smaller catalog
- Priority increases as inventory grows

**Technical Dependencies**: Requires Product Catalog

**Launch Blocker**: NO - Can browse full catalog initially

**Post-Launch Timeline**: Add when catalog exceeds ~50 items

---

### 8. Condition Grading System
**Priority Level**: Should Have  
**Personas Served**: Alex Martinez (Buyer), Jordan Lee (Admin)  
**User Stories**: US-03

**Rationale**:
- **Alex's Pain Point**: "Unclear descriptions, inconsistent sizing"
- **Journey Stage**: Evaluate → "Is this authentic and worth it?"
- Can be implemented as text field initially, structured grading later
- Important for vintage items but can start with detailed descriptions

**Technical Dependencies**: Integrates with Product Catalog

**Launch Blocker**: NO - Can describe condition in product description initially

**Implementation Path**: V1 = text field, V2 = standardized dropdown with icons

---

### 9. Image Gallery (Multiple Photos)
**Priority Level**: Should Have  
**Personas Served**: Alex Martinez (Buyer), Jordan Lee (Admin)  
**User Stories**: US-03

**Rationale**:
- **Alex's Pain Point**: "Poor photos"
- **Jordan's Frustration**: "Managing product images and condition data"
- Critical for vintage items to show condition from multiple angles
- Can launch with single image per product, expand later

**Technical Dependencies**: Requires Product Catalog, Image storage solution

**Launch Blocker**: NO - One good photo is minimum viable

**Implementation Path**: V1 = single image, V2 = gallery carousel

---

## COULD HAVE - Future Iterations

### 10. Wishlist / Favorites
**Priority Level**: Could Have  
**Personas Served**: Alex Martinez (Buyer)  
**User Stories**: US-06

**Rationale**:
- **Alex's Behavior**: "Saves items to revisit later"
- Nice-to-have for user experience; users can bookmark pages
- Low complexity but not launch-critical

**Technical Dependencies**: Requires Authentication, Product Catalog

**Launch Blocker**: NO - Users can save items via browser bookmarks

**Future Value**: Useful for email campaigns, retargeting

---

### 11. Inventory Management (Advanced)
**Priority Level**: Could Have  
**Personas Served**: Jordan Lee (Admin)  
**User Stories**: US-08

**Rationale**:
- **Jordan's Need**: "Clear visibility into stock status"
- Basic inventory handled in Admin Dashboard (Must Have)
- Advanced features: bulk upload, low stock alerts, analytics
- Can manage manually at small scale

**Technical Dependencies**: Requires Admin Dashboard

**Launch Blocker**: NO - Basic CRUD sufficient for launch

**Advanced Features for Later**: CSV import, stock alerts, inventory reports

---

### 12. Moderation Tools
**Priority Level**: Could Have  
**Personas Served**: Jordan Lee (Admin)  
**User Stories**: US-09

**Rationale**:
- **Jordan's Need**: "Moderate customer content"
- Only needed once Reviews feature is live
- Can moderate manually through database initially

**Technical Dependencies**: Requires Reviews feature, Admin Dashboard

**Launch Blocker**: NO - Not needed until reviews are enabled

---

### 13. Order History & Tracking
**Priority Level**: Could Have  
**Personas Served**: Alex Martinez (Buyer), Jordan Lee (Admin)  
**User Stories**: N/A

**Rationale**:
- **Journey Stage**: Post-Purchase
- Enhances user experience but not critical for MVP
- Can send email confirmations initially

**Technical Dependencies**: Requires Authentication, Shopping Cart/Checkout

**Launch Blocker**: NO - Email confirmations sufficient for MVP

---

### 14. Order Management (Admin)
**Priority Level**: Could Have  
**Personas Served**: Jordan Lee (Admin)  
**User Stories**: N/A

**Rationale**:
- **Jordan's Need**: Fulfill orders efficiently
- Can manage via database + email initially
- Important for scaling but not launch-critical

**Technical Dependencies**: Requires Admin Dashboard, Shopping Cart

**Launch Blocker**: NO - Manual fulfillment OK at small scale

---

## WON'T HAVE (This Semester)

### 15. User Profile Management
**Rationale**: Basic account info sufficient; shipping addresses can be entered at checkout
**Future Consideration**: Add if time permits in Milestone 5

---

## Feature Dependency Map

```
Product Catalog (MUST) ←── Foundation
    ↓
    ├─→ Shopping Cart (MUST)
    ├─→ Search & Filter (SHOULD)
    ├─→ Reviews (SHOULD)
    └─→ Wishlist (COULD)

Authentication (MUST) ←── Identity Layer
    ↓
    ├─→ Admin Dashboard (MUST)
    ├─→ Shopping Cart (MUST)
    ├─→ Reviews (SHOULD)
    └─→ Wishlist (COULD)

Admin Dashboard (MUST) ←── Management Layer
    ↓
    ├─→ Inventory Management (COULD)
    └─→ Moderation Tools (COULD)
```

---

## Sprint Planning Recommendation

### Milestone 3 (Development Start)
**Focus**: Must Have - Core Commerce
1. Product Catalog with basic display
2. User Authentication
3. Admin Dashboard (CRUD operations)

### Milestone 4 (Full Features)
**Focus**: Complete Must Haves + Top Should Haves
1. Shopping Cart
2. Search & Filtering
3. Image Gallery
4. Condition Grading

### Milestone 5 (Polish & Deploy)
**Focus**: Should Have + Deployment
1. Reviews and Ratings
2. Cloud Deployment
3. Testing & bug fixes
4. Could Have features (if time)

---

## GitHub Kanban Board Organization

### Columns:
1. **Backlog** - All features not yet prioritized for current sprint
2. **Must Have (Sprint 1)** - MVP launch features
3. **Should Have (Sprint 2)** - Post-launch enhancements
4. **Could Have (Future)** - Nice-to-haves
5. **In Progress** - Currently being worked on
6. **Done** - Completed features

### Labels to Use:
- `must-have` - MVP blockers
- `should-have` - Important post-launch
- `could-have` - Future enhancements
- `persona:alex` - Serves buyer persona
- `persona:jordan` - Serves admin persona
- `journey:discover` - Addresses discovery stage
- `journey:browse` - Addresses browsing stage
- `journey:evaluate` - Addresses evaluation stage
- `journey:purchase` - Addresses purchase stage
- `journey:post-purchase` - Addresses post-purchase stage
- `technical-dependency` - Required by other features

---

## Validation Against Personas

### Alex Martinez (Buyer) Needs - Coverage
✅ Find authentic vintage items → Product Catalog, Reviews  
✅ Understand condition clearly → Condition Grading, Image Gallery  
✅ Shop efficiently with confidence → Search/Filter, Authentication, Reviews  
✅ Easy checkout → Shopping Cart  

### Jordan Lee (Admin) Needs - Coverage
✅ Manage inventory efficiently → Admin Dashboard, Inventory Management  
✅ Ensure listing accuracy → Admin Dashboard, Image Gallery  
✅ Maintain brand trust → Reviews, Moderation Tools  
✅ Clear visibility into stock → Admin Dashboard, Inventory Management  

---

**Next Steps**:
1. Create GitHub Project Kanban board
2. Move existing issues into appropriate priority columns
3. Add labels based on priority, persona, and journey stage
4. Link user stories to features as sub-issues
5. Update issue descriptions with acceptance criteria from user stories

**AI Tool Usage**: This prioritization was developed using Claude to analyze persona pain points, journey map stages, and technical dependencies to create a data-driven feature roadmap aligned with MVP launch strategy.
