# Hisaab - Multi-Store Invoice Management System

## Architecture Overview

**Core Concept**: Multi-tenant business management platform where users create stores, manage products, track customers globally, and generate invoices. Built with Next.js 16, React 19, Prisma, PostgreSQL, and NextAuth.

**Key Data Model**: 
- Users own multiple Stores
- Customers are GLOBAL (belong to User, not Store) and linked via CustomerStore junction table
- Products belong to Stores
- Invoices link Customer + Store + InvoiceItems
- Phone numbers are unique customer identifiers (used throughout API)

**Critical Files**:
- [prisma/schema.prisma](prisma/schema.prisma) - Database schema with CustomerStore junction pattern
- [lib/auth.ts](lib/auth.ts) - NextAuth config with Google + Credentials providers
- [middleware.ts](middleware.ts) - Protected routes: `/dashboard/*`, `/store/*`, `/billing/*`, etc.

## Development Commands

```bash
npm run dev --turbo    # Start dev server with Turbo
npm run build          # Production build
npm run seed           # Seed database via tsx prisma/seed.ts
```

**Database**: PostgreSQL via Prisma. Run migrations before seeding.

## Authentication Pattern

All API routes use server-side auth:
```typescript
const session = await getServerSession(authOptions);
if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
```

- Auth config: [lib/auth.ts](lib/auth.ts)
- Protected routes: Middleware wraps `/dashboard/*` paths
- Session strategy: JWT (not database sessions)
- Custom signin page: `/signin` (not default NextAuth UI)

## API Route Conventions

**Pattern**: All routes in `app/api/*` follow consistent structure:
1. Import `getServerSession`, `authOptions`, `prisma`
2. Check authentication first
3. Find user by `session.user.email`
4. Validate request body
5. Return JSON with proper status codes

**Example** ([app/api/stores/route.ts](app/api/stores/route.ts)):
```typescript
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  // ... business logic
}
```

## Customer Management - CRITICAL PATTERN

**Customers are GLOBAL, not per-store**:
- Created at user level via [app/api/customers/store/route.ts](app/api/customers/store/route.ts)
- Linked to stores via `CustomerStore` junction table (upsert pattern)
- Phone is unique identifier across system
- Auto-linked to stores when creating invoices (see [app/api/invoices/route.ts](app/api/invoices/route.ts#L40-L48))

**CustomerStore Upsert Pattern**:
```typescript
await prisma.customerStore.upsert({
  where: { customerId_storeId: { customerId, storeId } },
  update: { attendedAt: new Date() },
  create: { customerId, storeId }
});
```

## Invoice Creation Flow

1. Validate customer exists by phone (404 if not found)
2. Auto-link customer to store via CustomerStore upsert
3. Fetch products, validate stock availability
4. Calculate total, create invoice with nested InvoiceItems
5. Decrement product quantities in transaction
6. Send email via [lib/mail-service.ts](lib/mail-service.ts)

**Transaction Pattern** (invoices reduce product stock atomically):
```typescript
const invoice = await prisma.invoice.create({
  data: {
    customerId, storeId, totalAmount,
    items: { create: invoiceItems }
  }
});

for (const item of items) {
  await prisma.product.update({
    where: { id: item.productId },
    data: { quantity: { decrement: item.quantity } }
  });
}
```

## UI/Component Standards

- **UI Library**: Radix UI primitives in [components/ui/](components/ui/)
- **Styling**: Tailwind with `rounded-2xl` preference for cards/buttons
- **Layout**: [components/layout/navbar.tsx](components/layout/navbar.tsx) and [sidebar.tsx](components/layout/sidebar.tsx)
- **Theme**: Dark mode via next-themes (see [app/providers.tsx](app/providers.tsx))
- **Icons**: Lucide React (`<IndianRupee />`, `<Package />`, etc.)
- **Notifications**: Sonner for toasts

## Project-Specific Patterns

1. **Empty Schema Files**: [lib/schemas/](lib/schemas/) directory exists but files are placeholders (not used for validation yet)
2. **Store-Scoped Routes**: `/dashboard/stores/[storeId]/*` for store-specific views
3. **Indian Rupee**: Use `₹` symbol and `<IndianRupee />` icon throughout
4. **Image URLs**: Products have optional `imageUrl` field (Cloudinary integration planned per [todo.md](todo.md))
5. **Email Service**: Nodemailer wrapper in [lib/mail-service.ts](lib/mail-service.ts) for invoice delivery

## Upcoming Features (from todo.md)

- GST support in invoices
- PDF export (jsPDF/pdfkit already installed)
- Image generation via AI (Google Generative AI installed)
- Charts for dashboard analytics
- AI chatbot for custom queries

## Common Gotchas

- **Don't create store-specific customers** - they're global and linked via CustomerStore
- **Phone uniqueness** - Customer phone must be unique across entire system
- **Auth check order** - Always check session before accessing `session.user.email`
- **Prisma client** - Import from `@/lib/prisma`, not direct `@prisma/client`
- **Route params** - Store ID comes from URL params in `[storeId]` dynamic routes
