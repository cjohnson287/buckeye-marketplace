# AGENTS.md

Guidelines for AI coding agents working in this React + TypeScript frontend repository.

---

## Milestone 3: Product Catalog — Vertical Slice 1

**Points:** 25 | **Due:** Friday, March 6 by 11:59 PM

### What You're Building
- **Product List Page** — displays all products as cards with title, price, category, seller name
- **Product Detail Page** — shows full details for a single product (all 8 required fields)
- **API integration** — fetches live data from .NET API; no hardcoded product data in components
- **React Router** — navigation between list and detail pages works both ways

### Required Product Fields
1. `id` — unique identifier
2. `title` — product name
3. `description` — seller's description
4. `price` — listed price (number)
5. `category` — e.g., Textbooks, Electronics, Furniture, Clothing
6. `sellerName` — display name of the seller
7. `postedDate` — when the listing was created (ISO string)
8. `imageUrl` — product image URL (placeholder acceptable)

## Stack

| Layer       | Tool                           |
| ----------- | ------------------------------ |
| Framework   | React 18 + TypeScript (strict) |
| Build Tool  | Vite                           |
| Routing     | React Router v6                |
| Styling     | CSS Modules                    |
| HTTP Client | Fetch API                      |
| Dev Server  | localhost:5173                 |

---

## Project Structure

```
frontend/
├── src/
│   ├── api/                    # API service functions (fetch calls)
│   │   └── products.ts
│   ├── components/             # Reusable components
│   │   ├── ProductCard/
│   │   │   ├── ProductCard.tsx
│   │   │   └── ProductCard.module.css
│   │   ├── FilterSidebar/
│   │   │   ├── FilterSidebar.tsx
│   │   │   └── FilterSidebar.module.css
│   │   ├── CartSidebar/
│   │   │   ├── CartSidebar.tsx
│   │   │   └── CartSidebar.module.css
│   │   └── Layout/
│   │       ├── Layout.tsx
│   │       └── Layout.module.css
│   ├── contexts/                # React Context providers
│   │   └── CartContext.tsx
│   ├── pages/                  # Page-level components (route targets)
│   │   ├── ProductListPage.tsx
│   │   ├── ProductDetailPage.tsx
│   │   └── CheckoutPage.tsx
│   ├── reducers/               # Reducer logic for complex state
│   │   └── cartReducer.ts
│   ├── types/                  # TypeScript interfaces and types
│   │   ├── product.ts
│   │   └── cart.ts
│   ├── App.tsx
│   ├── main.tsx
│   ├── index.css
│   └── App.css
├── index.html
├── vite.config.ts
├── tsconfig.json
├── package.json
└── eslint.config.js
```

### Rules

- **Components** (in `src/components/`) are reusable UI pieces, not tied to specific routes.
- **Pages** (in `src/pages/`) are route targets that compose components.
- One component per folder: `ComponentName/ComponentName.tsx` + `ComponentName.module.css`.
- API calls live in `src/api/` as named functions, never in components directly.
- Shared types in `src/types/` — organized by domain (products, cart, etc.).
- Global state (cart, auth) lives in `src/contexts/` with corresponding reducers in `src/reducers/`.
- CSS Modules only — no inline styles, no global CSS except `index.css`.

---

## Components

### Anatomy

All components are **functional**, never class-based. Props are destructured in the function signature with explicit TypeScript types.

```typescript
// ✅ Good
import styles from './ProductCard.module.css';

interface ProductCardProps {
  id: number;
  name: string;
  price: decimal;
  imageUrl?: string;
  onAddToCart: (id: number) => void;
}

export function ProductCard({
  id,
  name,
  price,
  imageUrl,
  onAddToCart
}: ProductCardProps) {
  return (
    <div className={styles.card}>
      <img src={imageUrl} alt={name} />
      <h3>{name}</h3>
      <p>${price.toFixed(2)}</p>
      <button
        aria-label={`Add ${name} to cart`}
        onClick={() => onAddToCart(id)}
      >
        Add to Cart
      </button>
    </div>
  );
}
```

```typescript
// ❌ Bad
export const ProductCard = (props) => {
  return (
    <div style={{ padding: '1rem' }}>
      <img src={props.imageUrl} alt={props.name} />
      <h3>{props.name}</h3>
      <p>${props.price}</p>
      <button onClick={() => props.onAddToCart(props.id)}>Add</button>
    </div>
  );
};
```

### Rules

- **Always** define a Props interface: `interface ComponentNameProps { ... }`
- **Always** destructure props: `({ name, price, onAdd }: ComponentNameProps) => { ... }`
- **Always** include `aria-label` on buttons and interactive elements.
- **Always** use named exports: `export function MyComponent() { ... }`
- Default export is reserved for page components only.
- Use TypeScript `interface` for component props (object shapes).
- Use TypeScript `type` for unions/discriminated unions.
- No inline styles. CSS Modules only.
- No `any` types. If necessary, use `unknown` and narrow it.
- Props are immutable — components receive data, don't mutate it.

---

## Styling

All styling uses **CSS Modules**. Never use inline styles or global CSS (except `index.css` for reset/variables).

### CSS Modules Pattern

```typescript
// ProductCard.tsx
import styles from './ProductCard.module.css';

export function ProductCard({ name }: ProductCardProps) {
  return (
    <div className={styles.card}>
      <h3 className={styles.title}>{name}</h3>
    </div>
  );
}
```

```css
/* ProductCard.module.css */
.card {
  border: 1px solid #ddd;
  padding: 1rem;
  border-radius: 4px;
  background: #fff;
}

.title {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
}
```

### Rules

- Every component folder has a matching `.module.css` file.
- Class names in CSS Modules are camelCase: `.cardContainer`, not `.card-container`.
- Avoid deeply nested selectors. Keep specificity low.
- Use semantic HTML: `<button>`, `<nav>`, `<main>`, etc.
- No global styles except `index.css` (resets, CSS variables, font imports).

---

## API Calls

All HTTP requests are in `src/api/` as named functions. Components never call `fetch()` directly.

### API Service Pattern

```typescript
// src/api/products.ts
import { Product, ProductResponse } from '../types/product';

export async function fetchProducts(
  category?: string,
  minPrice?: number,
  maxPrice?: number
): Promise<Product[]> {
  const params = new URLSearchParams();
  if (category) params.append('category', category);
  if (minPrice) params.append('minPrice', minPrice.toString());
  if (maxPrice) params.append('maxPrice', maxPrice.toString());

  const response = await fetch(
    `https://localhost:5001/api/products?${params}`,
    {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.statusText}`);
  }

  const data: ProductResponse[] = await response.json();
  return data.map(p => ({
    id: p.id,
    name: p.name,
    description: p.description,
    price: p.price,
    categoryName: p.categoryName,
    imageUrl: p.imageUrl
  }));
}

export async function fetchProductById(id: number): Promise<Product> {
  const response = await fetch(
    `https://localhost:5001/api/products/${id}`,
    {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch product: ${response.statusText}`);
  }

  const data: ProductResponse = await response.json();
  return {
    id: data.id,
    name: data.name,
    description: data.description,
    price: data.price,
    categoryName: data.categoryName,
    imageUrl: data.imageUrl
  };
}
```

### Component Usage

```typescript
// ProductListPage.tsx
import { useEffect, useState } from 'react';
import { fetchProducts } from '../api/products';
import { Product } from '../types/product';

export default function ProductListPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoading(true);
        const data = await fetchProducts();
        setProducts(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {products.map(p => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
```

### Rules

- One function per endpoint.
- Async functions only — all API calls use `async`/`await`.
- Map backend DTOs to frontend types if they differ.
- Throw descriptive errors on failure; let components handle them.
- Never swallow errors — let the caller decide how to handle them.
- Use `URLSearchParams` for query strings.
- Set `Content-Type: application/json` on all requests.

---

## Data Fetching & State Management

### useState + useEffect for simple fetches

```typescript
const [data, setData] = useState<T[]>([]);
const [isLoading, setIsLoading] = useState(true);
const [error, setError] = useState<string | null>(null);

useEffect(() => {
  const load = async () => {
    try {
      setIsLoading(true);
      const result = await fetchData();
      setData(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  load();
}, []);

if (isLoading) return <div>Loading...</div>;
if (error) return <div>Error: {error}</div>;

return <div>{/* render data */}</div>;
```

### Context + useReducer for complex state (cart, auth)

```typescript
// src/contexts/CartContext.tsx
import React, { createContext, useReducer, ReactNode } from 'react';
import { cartReducer, initialCartState } from '../reducers/cartReducer';

export interface CartContextType {
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialCartState);

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = React.useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}
```

```typescript
// src/reducers/cartReducer.ts
import { CartState, CartAction } from '../types/cart';

export const initialCartState: CartState = {
  items: [],
  totalPrice: 0
};

export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find(item => item.id === action.payload.id);
      if (existing) {
        return {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        };
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }]
      };
    }
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload)
      };
    case 'CLEAR_CART':
      return initialCartState;
    default:
      return state;
  }
}
```

### Rules

- Use `useState` for simple, independent state (isLoading, error, data for a single fetch).
- Use `useReducer` + `Context` for complex, interdependent state (cart, auth, filters).
- Always handle three states: loading, error, success.
- Wrap API calls in try/catch; set error state on failure.
- Use `finally` to reset loading state.
- Never call side effects outside useEffect.
- Dependencies array matters: `useEffect(() => { ... }, [dependency])`.

---

## Routing

React Router v6 is used for navigation. All routes are defined at the top level.

```typescript
// src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import ProductListPage from './pages/ProductListPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CheckoutPage from './pages/CheckoutPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/products" element={<ProductListPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/" element={<ProductListPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
```

```typescript
// Components use useNavigate and Link for navigation
import { useNavigate, Link } from 'react-router-dom';

export function ProductCard({ id, name }: ProductCardProps) {
  const navigate = useNavigate();

  return (
    <div>
      <Link to={`/products/${id}`}>{name}</Link>
      <button onClick={() => navigate(`/products/${id}`)}>View Details</button>
    </div>
  );
}
```

### Rules

- All routes defined in one place (App.tsx or routes file).
- Use `<Link>` for navigation (preferable).
- Use `useNavigate()` for programmatic navigation in event handlers.
- Use `useParams()` to read URL parameters in page components.
- Use `useSearchParams()` for query strings (filters, pagination).
- Route paths match backend API endpoints where possible: `/products`, `/products/:id`.

---

## Types

All shared types live in `src/types/` organized by domain.

```typescript
// src/types/product.ts
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  categoryName: string;
  imageUrl?: string;
}

// Backend DTO (may differ from Product)
export interface ProductResponse {
  id: number;
  name: string;
  description: string;
  price: number;
  categoryName: string;
  imageUrl?: string;
}

export type ProductFilter = {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
};
```

```typescript
// src/types/cart.ts
export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  totalPrice: number;
}

export type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: number }
  | { type: 'CLEAR_CART' };
```

### Rules

- One file per domain (products, cart, auth, etc.).
- Use `interface` for object shapes (props, state, API responses).
- Use `type` for unions and discriminated unions (`CartAction`).
- Export types, not defaults.
- Interfaces are immutable by design — don't mutate.
- Use `?` for optional properties; avoid `| undefined`.

---

## Error Handling

```typescript
// ✅ Good: structured error handling
try {
  const data = await fetchProducts();
  setProducts(data);
} catch (err) {
  const message = err instanceof Error ? err.message : 'Unknown error';
  setError(message);
}

// ❌ Bad: silent failures
const data = await fetchProducts().catch(() => []);

// ❌ Bad: generic errors
try {
  // ...
} catch (err) {
  console.log('oops');
}
```

### Rules

- Always narrow error types: `err instanceof Error ? err.message : 'Unknown error'`.
- Never silently catch errors (`.catch(() => undefined)`).
- Display user-friendly error messages in the UI.
- Log errors server-side (via API) for debugging.
- Set error state and display to the user.

---

## Accessibility (a11y)

Every interactive element must be accessible.

```typescript
// ✅ Good
<button aria-label="Add to cart">
  <span>Add</span>
</button>

<input
  type="text"
  placeholder="Search products"
  aria-label="Search for products"
/>

<nav aria-label="Main navigation">
  <Link to="/products">Products</Link>
</nav>

// ❌ Bad
<div onClick={() => addToCart(id)}>Add</div>

<div>
  <input type="text" />
</div>

<div className="navbar">
  <span>Home</span>
</div>
```

### Rules

- All buttons have `aria-label` or descriptive text.
- Form inputs have `<label>` or `aria-label`.
- Use semantic HTML: `<button>`, `<nav>`, `<main>`, `<article>`, `<section>`.
- Never use `<div>` as a button. Use `<button>`.
- Test with keyboard navigation: Tab, Enter, Space, Escape.

---

## TypeScript Conventions

### Naming

| Element              | Style      | Example                   |
| -------------------- | ---------- | ------------------------- |
| Components           | PascalCase | `ProductCard`, `FilterUI` |
| Files (components)   | PascalCase | `ProductCard.tsx`         |
| Files (hooks, utils) | camelCase  | `useCart.ts`, `helpers.ts` |
| Interfaces/Types     | PascalCase | `ProductProps`, `CartState` |
| Functions            | camelCase  | `fetchProducts()`, `formatPrice()` |
| Constants            | UPPER_CASE | `MAX_ITEMS`, `API_BASE_URL` |
| Variables            | camelCase  | `isLoading`, `cartItems`  |

### Style

- Prefer `const` over `let` or `var`.
- Use arrow functions: `const fn = () => { }`.
- Use optional chaining: `obj?.prop?.nested`.
- Use nullish coalescing: `value ?? defaultValue`.
- Use template literals: `` `URL: ${base}/${path}` ``.
- Prefer type inference when obvious: `const count = 5` (not `const count: number = 5`).
- Explicit types for function returns and parameters.
- Use `React.ReactNode` for anything that renders (children, etc.).

---

## Common Patterns

### Controlled Input

```typescript
const [inputValue, setInputValue] = useState('');

return (
  <input
    type="text"
    value={inputValue}
    onChange={e => setInputValue(e.currentTarget.value)}
    placeholder="Search..."
  />
);
```

### Conditional Rendering

```typescript
// ✅ Ternary for two branches
return isLoading ? <Spinner /> : <Content />;

// ✅ Logical AND for one branch
return hasError && <ErrorMessage />;

// ✅ Switch for multiple states
return (
  <>
    {state === 'loading' && <Spinner />}
    {state === 'error' && <ErrorMessage />}
    {state === 'success' && <Content />}
  </>
);
```

### List Rendering with Keys

```typescript
// ✅ Good: stable ID as key
<ul>
  {products.map(p => (
    <li key={p.id}>{p.name}</li>
  ))}
</ul>

// ❌ Bad: index as key (breaks on reorder/filter)
<ul>
  {products.map((p, i) => (
    <li key={i}>{p.name}</li>
  ))}
</ul>
```

### useCallback for Event Handlers (if passed as prop)

```typescript
const handleAddToCart = useCallback((id: number) => {
  dispatch({ type: 'ADD_ITEM', payload: { id, ... } });
}, [dispatch]);

return <ProductCard onAddToCart={handleAddToCart} />;
```

---

## Do Nots

- Do not use class components. Always functional.
- Do not use inline styles. Use CSS Modules.
- Do not use `any`. Use `unknown` and narrow, or extract to a type.
- Do not fetch data in render. Always use `useEffect`.
- Do not mutate state directly. Always use setState or dispatch.
- Do not forget to set `aria-label` on interactive elements.
- Do not use index as key in lists (`key={i}`).
- Do not silently catch errors. Always handle and display them.
- Do not hardcode URLs. Use environment variables or constants.
- Do not expose component internals — keep props contract simple.
- Do not mix concerns: keep components, API calls, and state separate.

---

## Development Workflow

### Running Locally

```bash
# Terminal 1: Backend
cd backend
dotnet run

# Terminal 2: Frontend
cd frontend
npm install
npm run dev
```

- Backend: https://localhost:5001
- Frontend: http://localhost:5173
- Swagger: https://localhost:5001/swagger

### Testing a Component

```typescript
// Manually test in browser
// Dev tools: React DevTools (to inspect state/props)
// Console: Check for errors/warnings

// Example: Click a button, verify dispatch was called
const { debug } = render(<ProductCard {...props} />);
screen.getByText('Add to Cart').click();
// Check context/reducer state changed
```

### Hot Module Reload

- Vite provides HMR by default. Changes to `.tsx` and `.css` are hot-reloaded.
- Changes to types may require a manual refresh.

---

## Environment Variables

Create a `.env` file in the `frontend/` root (not in `src/`):

```
VITE_API_BASE_URL=https://localhost:5001/api
```

Access in code:

```typescript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
```

---

## Summary of Key Differences from Backend

| Aspect          | Backend (.NET)              | Frontend (React)               |
| --------------- | --------------------------- | ------------------------------ |
| State mgmt      | Stateless (DB driven)       | useState, useReducer, Context  |
| Error handling  | ProblemDetails              | try/catch → setError state     |
| Typing          | C# strict typing            | TypeScript strict mode         |
| Testing         | N/A for M3                  | Manual + Dev Tools             |
| Code structure  | Services → Controllers      | API functions → Components     |
| Styling         | N/A                         | CSS Modules per component      |
| Data flow       | Controllers → EF queries    | Components → API → Context     |
