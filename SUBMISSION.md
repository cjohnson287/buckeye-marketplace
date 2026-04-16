# SUBMISSION

## Test Credentials

### Admin user (seeded)
- Email: admin@buckeye.local
- Password: Admin1234

### Regular user (seeded)
- Email: student@buckeye.local
- Password: Student123

## Security Practices Applied
1. **JWT secret in user secrets**: `Jwt:Key` is stored using `dotnet user-secrets`, not committed to source control.
2. **JWT claim-scoped resource access**: cart and `GET /api/orders/mine` are filtered by the authenticated `NameIdentifier` claim.
3. **Role-based endpoint protection**: admin-only product/order management endpoints enforce `[Authorize(Roles = "Admin")]`.
4. **Secure transport/headers**: HTTPS redirect plus `X-Content-Type-Options`, `X-Frame-Options`, and `Referrer-Policy` headers.

## AI Usage
- See AI usage log: [AI-USAGE.md](AI-USAGE.md)
