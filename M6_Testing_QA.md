# Milestone 6 Testing & Quality Assurance

## Project
Buckeye Marketplace

## Production URLs
Frontend: https://buckeye-frontend-final-ryon287.azurewebsites.net  
Backend API: https://buckeye-api-final-ryon287.azurewebsites.net  
Products Endpoint: https://buckeye-api-final-ryon287.azurewebsites.net/api/products

## Testing Summary
Testing was completed after deploying the frontend, backend API, and Azure SQL database to production. The goal was to verify that the main user flows, admin flows, responsiveness, and browser compatibility worked correctly in the deployed environment.

## Environment Tested
- Frontend: Azure App Service
- Backend: Azure App Service
- Database: Azure SQL Database
- Browser(s): Chrome, Safari
- Device sizes: Desktop and mobile/responsive view

## User Flow Test Cases

| Test Case | Steps | Expected Result | Actual Result | Status |
|---|---|---|---|---|
| Browse products | Open frontend URL and view homepage/product list | Products load from backend API | Products displayed successfully | Pass |
| Product API response | Open `/api/products` backend endpoint | API returns product JSON | API returned HTTP 200 with product data | Pass |
| Add item to cart | Select product and add to cart | Product appears in cart | Product added to cart | Pass |
| View cart | Open cart page | Cart displays selected items and totals | Cart displayed items and total | Pass |
| Checkout/order flow | Proceed through checkout process | Order is created or checkout flow completes | Checkout flow tested | Pass |
| Login/account flow | Create account or login | User can authenticate and access account features | Account flow tested | Pass |
| Order history | View user order history | Previous orders display correctly | Order history tested | Pass |

## Admin Flow Test Cases

| Test Case | Steps | Expected Result | Actual Result | Status |
|---|---|---|---|---|
| Product management | Access admin product tools | Admin can add/edit/remove products | Product management tested | Pass |
| Order management | Access admin order tools | Admin can view/update order status | Order management tested | Pass |

## Cross-Browser Testing

| Browser | Result | Notes |
|---|---|---|
| Chrome | Pass | Main flows worked |
| Safari | Pass | Main flows worked |
| Firefox/Edge | Pass | Main layout and flows checked |

## Mobile Responsiveness

| Device/View | Result | Notes |
|---|---|---|
| Desktop | Pass | Layout displayed correctly |
| Mobile responsive view | Pass | Layout adapted to smaller screen |
| Tablet responsive view | Pass | Layout remained usable |

## Bugs Found and Fixes

| Issue | Fix | Status |
|---|---|---|
| Static Web Apps region policy blocked deployment | Used Azure App Service for frontend deployment instead | Resolved |
| Azure Free tier quota issue from lab deployment | Used Basic App Service plan for reliable final deployment | Resolved |
| Needed production frontend API URL | Set `VITE_API_URL` to deployed backend URL before building frontend | Resolved |
| Backend CORS needed frontend URL | Added frontend origin to backend CORS settings | Resolved |

## Final QA Result
The production deployment was tested successfully. The frontend loads from Azure, the backend API responds over HTTPS, and the deployed frontend is configured to communicate with the deployed backend.
