# Component Architecture - Atomic Design
**Buckeye Marketplace - Product Catalog Feature**

## Overview

This document outlines the component hierarchy for the **Product Catalog** feature using Atomic Design principles. Atomic Design organizes UI components into five levels: Atoms → Molecules → Organisms → Templates → Pages.

**Scope**: Product Catalog feature only (as specified in Milestone 2 requirements)

---

## Atomic Design Hierarchy

```
PAGES (Routes)
└── ProductCatalogPage
    │
    TEMPLATES (Layout)
    └── ProductBrowseTemplate
        │
        ORGANISMS (Complex Components)
        ├── ProductGrid
        ├── FilterSidebar
        ├── ProductCard (multiple instances)
        │   │
        │   MOLECULES (Simple Components)
        │   ├── ProductImage
        │   ├── ProductInfo
        │   ├── PriceTag
        │   ├── ConditionBadge
        │   └── QuickViewButton
        │       │
        │       ATOMS (Basic Elements)
        │       ├── Button
        │       ├── Image
        │       ├── Text
        │       ├── Badge
        │       └── Icon
        │
        └── Pagination
            │
            MOLECULES
            ├── PageNumber
            └── NavButton
                │
                ATOMS
                ├── Button
                └── Icon
```

---

## Component Breakdown

### Level 1: Atoms (Fundamental Building Blocks)

Atoms are the most basic UI elements that cannot be broken down further without losing meaning.

#### 1.1 Button
**Purpose**: Clickable action element  
**Props**:
- `variant`: 'primary' | 'secondary' | 'outline' | 'ghost'
- `size`: 'sm' | 'md' | 'lg'
- `onClick`: Function
- `disabled`: Boolean
- `children`: ReactNode

**Example Use Cases**:
- "Add to Cart" button
- "Quick View" button
- Filter apply/reset buttons
- Pagination navigation

**Tailwind Classes**:
```jsx
const Button = ({ variant = 'primary', size = 'md', onClick, disabled, children }) => {
  const baseClasses = 'rounded-lg font-medium transition-all';
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50',
    ghost: 'text-blue-600 hover:bg-blue-50'
  };
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
```

---

#### 1.2 Image
**Purpose**: Display images with lazy loading and alt text  
**Props**:
- `src`: String (image URL)
- `alt`: String (accessibility)
- `className`: String (Tailwind classes)
- `loading`: 'lazy' | 'eager'

**Example Use Cases**:
- Product photos
- Category icons
- Logos

```jsx
const Image = ({ src, alt, className = '', loading = 'lazy' }) => (
  <img
    src={src}
    alt={alt}
    className={className}
    loading={loading}
  />
);
```

---

#### 1.3 Text
**Purpose**: Styled typography with consistent hierarchy  
**Props**:
- `variant`: 'h1' | 'h2' | 'h3' | 'body' | 'caption'
- `children`: ReactNode
- `className`: String (additional classes)

**Example Use Cases**:
- Product names
- Prices
- Descriptions
- Filter labels

```jsx
const Text = ({ variant = 'body', children, className = '' }) => {
  const variantClasses = {
    h1: 'text-3xl font-bold',
    h2: 'text-2xl font-semibold',
    h3: 'text-xl font-medium',
    body: 'text-base',
    caption: 'text-sm text-gray-600'
  };

  const Tag = variant.startsWith('h') ? variant : 'p';

  return (
    <Tag className={`${variantClasses[variant]} ${className}`}>
      {children}
    </Tag>
  );
};
```

---

#### 1.4 Badge
**Purpose**: Small status indicators (condition, category)  
**Props**:
- `color`: 'green' | 'yellow' | 'red' | 'blue' | 'gray'
- `children`: ReactNode

**Example Use Cases**:
- Condition grading ("Like New", "Good", "Fair")
- Stock status ("In Stock", "Low Stock")
- Category tags

```jsx
const Badge = ({ color = 'gray', children }) => {
  const colorClasses = {
    green: 'bg-green-100 text-green-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    red: 'bg-red-100 text-red-800',
    blue: 'bg-blue-100 text-blue-800',
    gray: 'bg-gray-100 text-gray-800'
  };

  return (
    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${colorClasses[color]}`}>
      {children}
    </span>
  );
};
```

---

#### 1.5 Icon
**Purpose**: Visual symbols for actions and categories  
**Props**:
- `name`: String (icon identifier)
- `size`: Number (pixels)
- `color`: String (hex or Tailwind color)

**Implementation**: Use Heroicons or Lucide React

**Example Use Cases**:
- Star for ratings
- Heart for wishlist
- Filter funnel icon
- Chevron for pagination

```jsx
import { StarIcon, HeartIcon, FunnelIcon } from '@heroicons/react/24/outline';

const Icon = ({ name, size = 20, color = 'currentColor', className = '' }) => {
  const icons = {
    star: StarIcon,
    heart: HeartIcon,
    filter: FunnelIcon,
    // ... more icons
  };

  const IconComponent = icons[name];
  return <IconComponent width={size} height={size} color={color} className={className} />;
};
```

---

### Level 2: Molecules (Simple Component Groups)

Molecules combine atoms into functional groups.

#### 2.1 ProductImage
**Purpose**: Product image with hover zoom and fallback  
**Composed of**: Image (Atom)  
**Props**:
- `src`: String
- `alt`: String
- `onHover`: Function (optional)

**Features**:
- Lazy loading
- Hover scale effect
- Placeholder for missing images

```jsx
const ProductImage = ({ src, alt, onHover }) => (
  <div className="relative overflow-hidden rounded-lg aspect-square bg-gray-100">
    <Image
      src={src || '/placeholder-product.jpg'}
      alt={alt}
      className="object-cover w-full h-full transition-transform duration-300 hover:scale-110"
      onMouseEnter={onHover}
    />
  </div>
);
```

---

#### 2.2 ProductInfo
**Purpose**: Display product name and category  
**Composed of**: Text (Atom) × 2  
**Props**:
- `name`: String
- `category`: String

```jsx
const ProductInfo = ({ name, category }) => (
  <div className="mt-2">
    <Text variant="caption" className="text-gray-500">{category}</Text>
    <Text variant="body" className="font-medium mt-1">{name}</Text>
  </div>
);
```

---

#### 2.3 PriceTag
**Purpose**: Display price with formatting  
**Composed of**: Text (Atom)  
**Props**:
- `price`: Number
- `originalPrice`: Number (optional, for sales)

```jsx
const PriceTag = ({ price, originalPrice }) => (
  <div className="flex items-center gap-2 mt-2">
    <Text variant="h3" className="text-blue-600">${price.toFixed(2)}</Text>
    {originalPrice && (
      <Text variant="caption" className="line-through text-gray-400">
        ${originalPrice.toFixed(2)}
      </Text>
    )}
  </div>
);
```

---

#### 2.4 ConditionBadge
**Purpose**: Display condition grading with color coding  
**Composed of**: Badge (Atom)  
**Props**:
- `condition`: 'like-new' | 'good' | 'fair' | 'worn'

**User Need**: Alex's pain point - "unclear descriptions, inconsistent sizing"

```jsx
const ConditionBadge = ({ condition }) => {
  const conditionConfig = {
    'like-new': { label: 'Like New', color: 'green' },
    'good': { label: 'Good', color: 'blue' },
    'fair': { label: 'Fair', color: 'yellow' },
    'worn': { label: 'Worn', color: 'red' }
  };

  const config = conditionConfig[condition] || { label: 'Unknown', color: 'gray' };

  return <Badge color={config.color}>{config.label}</Badge>;
};
```

---

#### 2.5 QuickViewButton
**Purpose**: Trigger product quick view modal  
**Composed of**: Button (Atom) + Icon (Atom)  
**Props**:
- `onClick`: Function
- `productId`: String

```jsx
const QuickViewButton = ({ onClick, productId }) => (
  <Button
    variant="outline"
    size="sm"
    onClick={() => onClick(productId)}
    className="w-full mt-2"
  >
    <Icon name="eye" size={16} className="mr-2" />
    Quick View
  </Button>
);
```

---

#### 2.6 FilterCheckbox
**Purpose**: Checkbox with label for filters  
**Composed of**: Input (Atom) + Text (Atom)  
**Props**:
- `label`: String
- `checked`: Boolean
- `onChange`: Function

```jsx
const FilterCheckbox = ({ label, checked, onChange }) => (
  <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
    />
    <Text variant="body">{label}</Text>
  </label>
);
```

---

#### 2.7 PageNumber
**Purpose**: Pagination page number button  
**Composed of**: Button (Atom)  
**Props**:
- `number`: Number
- `active`: Boolean
- `onClick`: Function

```jsx
const PageNumber = ({ number, active, onClick }) => (
  <Button
    variant={active ? 'primary' : 'ghost'}
    size="sm"
    onClick={onClick}
    className="min-w-[40px]"
  >
    {number}
  </Button>
);
```

---

### Level 3: Organisms (Complex Components)

Organisms are complex UI components composed of molecules and atoms.

#### 3.1 ProductCard
**Purpose**: Display individual product in grid  
**Composed of**: ProductImage, ProductInfo, PriceTag, ConditionBadge, QuickViewButton  
**Props**:
- `product`: Object { id, name, category, price, condition, imageUrl }
- `onQuickView`: Function
- `onAddToCart`: Function (future)

**User Need**: Alex's journey stage - Browse → "Do they have my style/size?"

```jsx
const ProductCard = ({ product, onQuickView }) => {
  const { id, name, category, price, condition, imageUrl } = product;

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4">
      <ProductImage src={imageUrl} alt={name} />
      <ProductInfo name={name} category={category} />
      <div className="flex items-center justify-between mt-2">
        <ConditionBadge condition={condition} />
        <PriceTag price={price} />
      </div>
      <QuickViewButton onClick={onQuickView} productId={id} />
    </div>
  );
};
```

---

#### 3.2 ProductGrid
**Purpose**: Display grid of product cards  
**Composed of**: ProductCard (Organism) × N  
**Props**:
- `products`: Array of product objects
- `onQuickView`: Function
- `loading`: Boolean

**Responsive Design**:
- Mobile: 1 column
- Tablet: 2 columns
- Desktop: 3-4 columns

```jsx
const ProductGrid = ({ products, onQuickView, loading }) => {
  if (loading) {
    return <LoadingSpinner />;
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <Text variant="h3">No products found</Text>
        <Text variant="caption" className="mt-2">Try adjusting your filters</Text>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onQuickView={onQuickView}
        />
      ))}
    </div>
  );
};
```

---

#### 3.3 FilterSidebar
**Purpose**: Filter products by category, condition, price  
**Composed of**: FilterCheckbox (Molecule) × N, Button (Atom)  
**Props**:
- `filters`: Object { categories, conditions, priceRange }
- `selectedFilters`: Object
- `onFilterChange`: Function
- `onReset`: Function

**User Need**: Alex's behavior - "Uses filters"

```jsx
const FilterSidebar = ({ filters, selectedFilters, onFilterChange, onReset }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
      <div className="flex items-center justify-between mb-4">
        <Text variant="h3">Filters</Text>
        <Button variant="ghost" size="sm" onClick={onReset}>
          Reset
        </Button>
      </div>

      {/* Category Filter */}
      <div className="mb-6">
        <Text variant="body" className="font-semibold mb-2">Category</Text>
        {filters.categories.map((category) => (
          <FilterCheckbox
            key={category}
            label={category}
            checked={selectedFilters.categories.includes(category)}
            onChange={() => onFilterChange('category', category)}
          />
        ))}
      </div>

      {/* Condition Filter */}
      <div className="mb-6">
        <Text variant="body" className="font-semibold mb-2">Condition</Text>
        {filters.conditions.map((condition) => (
          <FilterCheckbox
            key={condition}
            label={condition}
            checked={selectedFilters.conditions.includes(condition)}
            onChange={() => onFilterChange('condition', condition)}
          />
        ))}
      </div>

      {/* Price Range Filter */}
      <div className="mb-6">
        <Text variant="body" className="font-semibold mb-2">Price</Text>
        <input
          type="range"
          min={filters.priceRange.min}
          max={filters.priceRange.max}
          value={selectedFilters.maxPrice}
          onChange={(e) => onFilterChange('price', e.target.value)}
          className="w-full"
        />
        <Text variant="caption">Up to ${selectedFilters.maxPrice}</Text>
      </div>
    </div>
  );
};
```

---

#### 3.4 Pagination
**Purpose**: Navigate between pages of products  
**Composed of**: PageNumber (Molecule) × N, Button (Atom)  
**Props**:
- `currentPage`: Number
- `totalPages`: Number
- `onPageChange`: Function

```jsx
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <Icon name="chevron-left" size={16} />
        Previous
      </Button>

      {pages.map((page) => (
        <PageNumber
          key={page}
          number={page}
          active={page === currentPage}
          onClick={() => onPageChange(page)}
        />
      ))}

      <Button
        variant="ghost"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
        <Icon name="chevron-right" size={16} />
      </Button>
    </div>
  );
};
```

---

### Level 4: Templates (Page Layouts)

Templates define page structure without data.

#### 4.1 ProductBrowseTemplate
**Purpose**: Layout for product catalog page  
**Composed of**: FilterSidebar, ProductGrid, Pagination  
**Props**:
- `sidebar`: ReactNode
- `content`: ReactNode
- `pagination`: ReactNode

```jsx
const ProductBrowseTemplate = ({ sidebar, content, pagination }) => (
  <div className="container mx-auto px-4 py-8">
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Sidebar: 1 column on desktop */}
      <aside className="lg:col-span-1">
        {sidebar}
      </aside>

      {/* Main Content: 3 columns on desktop */}
      <main className="lg:col-span-3">
        {content}
        {pagination}
      </main>
    </div>
  </div>
);
```

---

### Level 5: Pages (Full Routes)

Pages are complete views that users navigate to.

#### 5.1 ProductCatalogPage
**Purpose**: Full product catalog page with state management  
**Composed of**: ProductBrowseTemplate  
**State**:
- `products`: Array (from API)
- `filters`: Object (available filters)
- `selectedFilters`: Object (user selections)
- `currentPage`: Number
- `loading`: Boolean

**User Stories Supported**:
- US-01: Browse Product Catalog
- US-02: Search & Filter Products
- US-03: View Product Details (via Quick View)

```jsx
import { useState, useEffect } from 'react';
import axios from 'axios';

const ProductCatalogPage = () => {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({
    categories: ['Jeans', 'T-Shirts', 'Vinyl', 'CDs'],
    conditions: ['like-new', 'good', 'fair'],
    priceRange: { min: 0, max: 200 }
  });
  const [selectedFilters, setSelectedFilters] = useState({
    categories: [],
    conditions: [],
    maxPrice: 200
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.get('/api/products', {
          params: {
            page: currentPage,
            categories: selectedFilters.categories.join(','),
            conditions: selectedFilters.conditions.join(','),
            maxPrice: selectedFilters.maxPrice
          }
        });
        setProducts(response.data.products);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
      setLoading(false);
    };

    fetchProducts();
  }, [currentPage, selectedFilters]);

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    setSelectedFilters((prev) => {
      if (filterType === 'category' || filterType === 'condition') {
        const key = filterType === 'category' ? 'categories' : 'conditions';
        const newArray = prev[key].includes(value)
          ? prev[key].filter((item) => item !== value)
          : [...prev[key], value];
        return { ...prev, [key]: newArray };
      } else if (filterType === 'price') {
        return { ...prev, maxPrice: value };
      }
      return prev;
    });
    setCurrentPage(1); // Reset to page 1 when filters change
  };

  // Reset filters
  const handleResetFilters = () => {
    setSelectedFilters({
      categories: [],
      conditions: [],
      maxPrice: 200
    });
    setCurrentPage(1);
  };

  // Quick view handler (would open modal)
  const handleQuickView = (productId) => {
    // TODO: Open modal with product details
    console.log('Quick view product:', productId);
  };

  return (
    <ProductBrowseTemplate
      sidebar={
        <FilterSidebar
          filters={filters}
          selectedFilters={selectedFilters}
          onFilterChange={handleFilterChange}
          onReset={handleResetFilters}
        />
      }
      content={
        <ProductGrid
          products={products}
          onQuickView={handleQuickView}
          loading={loading}
        />
      }
      pagination={
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      }
    />
  );
};

export default ProductCatalogPage;
```

---

## Component File Structure

```
src/
├── components/
│   ├── atoms/
│   │   ├── Button.jsx
│   │   ├── Image.jsx
│   │   ├── Text.jsx
│   │   ├── Badge.jsx
│   │   └── Icon.jsx
│   │
│   ├── molecules/
│   │   ├── ProductImage.jsx
│   │   ├── ProductInfo.jsx
│   │   ├── PriceTag.jsx
│   │   ├── ConditionBadge.jsx
│   │   ├── QuickViewButton.jsx
│   │   ├── FilterCheckbox.jsx
│   │   └── PageNumber.jsx
│   │
│   ├── organisms/
│   │   ├── ProductCard.jsx
│   │   ├── ProductGrid.jsx
│   │   ├── FilterSidebar.jsx
│   │   └── Pagination.jsx
│   │
│   └── templates/
│       └── ProductBrowseTemplate.jsx
│
├── pages/
│   └── ProductCatalogPage.jsx
│
└── services/
    └── api.js  (Axios instance for API calls)
```

---

## Benefits of This Architecture

### 1. Reusability
- **Button** used in ProductCard, FilterSidebar, Pagination
- **Text** used across all components
- **Badge** used in ConditionBadge, could be reused for stock status

### 2. Maintainability
- Each component has a single responsibility
- Easy to locate and update specific components
- Changes to Button propagate everywhere automatically

### 3. Testability
- Atoms are pure functions (easy to unit test)
- Organisms can be tested with mock props
- Pages can be integration tested

### 4. Scalability
- New features can reuse existing atoms/molecules
- Example: Shopping cart can reuse Button, PriceTag, ProductImage

### 5. Design Consistency
- Centralized styling in atoms ensures consistent look
- Tailwind utility classes maintain design system

---

## Validation Against User Needs

### Alex Martinez (Buyer)

| User Need | Component Support |
|-----------|------------------|
| "Browse extensively" | ProductGrid displays all products efficiently |
| "Use filters" | FilterSidebar with category, condition, price filters |
| "Read reviews" | (Future: ReviewList organism) |
| "Unclear descriptions" → Need clarity | ConditionBadge clearly shows condition |
| "Poor photos" → Need good visuals | ProductImage with hover zoom, lazy loading |

### Jordan Lee (Admin)

| User Need | Component Support |
|-----------|------------------|
| "Manage inventory efficiently" | (Future: Admin components will reuse atoms/molecules) |
| "Ensure listing accuracy" | Consistent ProductCard displays all data fields |
| "Admin dashboard" | (Future: Will use same atoms for consistency) |

---

## Future Expansion

When adding new features, these atoms/molecules can be reused:

### Shopping Cart Feature
- **Reuse**: Button, Text, Image, PriceTag
- **New**: CartItem (organism), CartSummary (organism)

### Reviews Feature
- **Reuse**: Text, Badge, Button, Icon (for star ratings)
- **New**: ReviewCard (molecule), ReviewList (organism)

### Admin Dashboard
- **Reuse**: Button, Text, Badge, Image
- **New**: DataTable (organism), FormInput (molecule), AdminSidebar (organism)

---

## Component Prop Type Definitions

For production, add PropTypes or TypeScript:

```jsx
import PropTypes from 'prop-types';

Button.propTypes = {
  variant: PropTypes.oneOf(['primary', 'secondary', 'outline', 'ghost']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  children: PropTypes.node.isRequired
};

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    condition: PropTypes.oneOf(['like-new', 'good', 'fair', 'worn']).isRequired,
    imageUrl: PropTypes.string
  }).isRequired,
  onQuickView: PropTypes.func.isRequired
};
```

---

## Accessibility Considerations

- **Button**: Proper `aria-label` for icon-only buttons
- **Image**: Always include `alt` text
- **FilterCheckbox**: Associate label with input via `htmlFor`
- **Pagination**: `aria-current="page"` for active page
- **Keyboard Navigation**: All interactive elements focusable with Tab

---

**AI Tool Usage**: This component architecture was designed using Claude AI to break down the Product Catalog feature into reusable components following Atomic Design principles. AI helped identify component hierarchy, reusability opportunities, and alignment with user needs from Milestone 1 personas and journey maps.

