# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

E-commerce store for "Dei & Dave" selling beddings and loungewear. Built with SvelteKit 2 + Svelte 5 (runes API), TypeScript, Tailwind CSS 4, and shadcn-svelte components. Uses PayMongo as the payment gateway and a separate backend API for inventory, discounts, payments, and sales.

## Commands

```bash
npm run dev              # Start dev server (port 5173)
npm run build            # Production build (adapter-node)
npm run preview          # Preview production build
npm run check            # Type-check with svelte-check
npm run check:watch      # Type-check in watch mode
npm run lint             # Prettier check + ESLint
npm run format           # Format all files with Prettier
```

No test framework is configured.

## Architecture

### Routing

SvelteKit file-based routing under `src/routes/`:
- `(base)/` — route group for product and checkout pages (beddings, loungewear, add-to-bag, check-out)
- `api/transactions/validate/` — PayMongo webhook/callback handler
- `+page.server.ts` files handle server-side data loading; `+server.ts` files handle API endpoints

### State Management

Svelte 5 runes throughout (`$state`, `$derived`, `$effect`, `$props`). Client-side stores live in `src/lib/client/`:
- `cart.svelte.ts` — Cart class with localStorage persistence, exposed via Svelte context (`setCartState`/`getCartState`)
- `shop.svelte.ts` — Shop state
- `order.svelte.ts` — Order state

### Service Layer

`src/lib/services/` contains API client functions and type definitions:
- `inventory.ts` — Product/inventory types (`InventoryItem`, `Product`)
- `payment.ts` — Payment API calls
- `paymongo.ts` — PayMongo gateway integration (payment intents, e-wallets, cards)
- `sales.ts` — Sales/order API calls
- `index.ts` — Shared types (`Order`, `AccountInfo`, `PaymentMethod`, `Discount`)

All backend API calls use JWT authentication (via `jose` library in `src/lib/utils/jwt-generator.ts`).

### Components

- `src/lib/components/ui/` — shadcn-svelte style UI primitives (button, card, dialog, form, input, stepper, loader, etc.)
- `src/lib/components/actions/` — Svelte actions (focus-trap, input-mask)
- UI built on `bits-ui` headless primitives with `tailwind-variants` for component variants
- `cn()` utility in `src/lib/utils.ts` merges Tailwind classes (clsx + tailwind-merge)

### Forms

Checkout uses `sveltekit-superforms` with `formsnap` for form handling and validation. CSRF tokens are generated server-side and stored in httpOnly cookies.

### External Integrations

- **PayMongo** — Payment processing (cards, GCash, PayMaya, GrabPay)
- **Cloudinary** — Image hosting with dynamic transformations (see `src/lib/utils/image-helper.ts`)
- **Facebook Pixel** — Tracking in root layout
- **Backend API** — Separate service (default port 5174) for inventory, discounts, payments, sales

### Environment Variables

Private (server-only): `API_KEY`, `DISCOUNTS_URL`, `INVENTORIES_URL`, `CART_ITEMS_URL`, `PAYMENT_URL`, `SALES_URL`, `PAYMONGO_SECRET_KEY`, `PAYMONGO_REDIRECT_URL`, `ORIGIN`

Public (client-accessible): `PUBLIC_HERO_IMAGE`, `PUBLIC_DEFAULT_PRODUCT_IMAGE`, `PUBLIC_APP_TITLE`, `PUBLIC_SHOW_BANNER`

## Code Style

- **Svelte 5 runes** — Use `$state`, `$derived`, `$effect`, `$props` (not legacy `let` exports or stores)
- **TypeScript strict mode** enabled
- **Prettier**: tabs, single quotes, no trailing commas, 100 char width
- **Tailwind CSS 4** with `@tailwindcss/vite` plugin — styles in `src/app.css` with CSS custom properties for theming
- **shadcn-svelte** conventions: components use index.ts barrel exports, aliases configured in `components.json` (`$lib/components/ui`, `$lib/hooks`, etc.)
- **Icons**: `@lucide/svelte`
