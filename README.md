# Knotify

A full-stack e-commerce platform with product search & filtering, JWT-based authentication, cart/wishlist, transactional checkout, Razorpay payments, and a dedicated admin dashboard for managing products, inventory, and orders.

**Frontend Repository:** [github.com/Fareen1808/knotify-frontend](https://github.com/Fareen1808)
**Backend Repository:** [github.com/Fareen1808/knotify-backend](https://github.com/Fareen1808)

## What It Does

Knotify is a two-sided e-commerce system: a customer-facing storefront for browsing, purchasing, and tracking orders, and an admin dashboard for managing the catalog and fulfillment. The backend exposes a REST API secured with JWT, backed by a normalized PostgreSQL schema, with caching on hot read paths and a transactional checkout flow that guards against overselling and double-charging.

## Core Features

- **JWT Authentication** — stateless auth with short-lived access tokens and long-lived refresh tokens; passwords hashed with BCrypt
- **Role-Based Access Control** — USER and ADMIN roles enforced at the endpoint level via Spring Security
- **Product Catalog** — keyword search, category and price-range filtering, sorting, and server-side pagination
- **Response Caching** — Caffeine-backed caching on product list, product-by-id, and search endpoints to cut repeated read latency
- **Cart & Wishlist** — persistent, per-user cart and wishlist with add/remove and running totals
- **Transactional Checkout** — order placement and stock decrements wrapped in `@Transactional` boundaries to prevent overselling and double-charges
- **Razorpay Integration** — payment creation and signature verification before an order is confirmed
- **Admin Dashboard** — product CRUD, inventory management, order lookup by user, and store-wide stats
- **Rate Limiting** — IP-based rate limiting on auth endpoints (20 requests/minute) to slow down brute-force login attempts
- **API Documentation** — interactive Swagger UI via springdoc-openapi
- **Versioned Schema** — all schema changes tracked and applied through Flyway migrations

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Java 17, Spring Boot 3, Spring Web |
| Security | Spring Security, JWT (jjwt), BCrypt |
| Persistence | Spring Data JPA / Hibernate, PostgreSQL |
| Migrations | Flyway |
| Caching | Caffeine |
| Payments | Razorpay Java SDK |
| API Docs | springdoc-openapi (Swagger UI) |
| Frontend | React 18, Vite, Redux Toolkit, React Router, Axios, Tailwind CSS |
| Deployment | Render (backend), Vercel (frontend) |

## Architecture / Request Flow

```
Client
  → Rate Limit Filter        (IP-based, auth endpoints only — 20 req/min)
    → JWT Filter              (validate access token, load user + role)
      → Controller             (Auth / Product / Cart / Wishlist / Order / Payment / Admin)
        → Service Layer        (business logic, @Transactional boundaries)
          → Repository Layer   (Spring Data JPA)
            → PostgreSQL
```

Read-heavy product endpoints (list, by-id, search) are cached in Caffeine on first read and evicted after 10 minutes, so repeated catalog browsing doesn't hit the database on every request.

Checkout runs through a single transactional boundary — payment verification, stock decrement, and order creation either all succeed or all roll back, which is what prevents an order being placed against stock that's already sold out.

## Database Schema

Modeled as a normalized relational schema with Flyway-versioned migrations:

```
users, product, cart, cart_item, orders, order_item, payment, wishlist, wishlist_item
```

Indexes were added in a later migration (`V2__add_query_indexes.sql`) specifically to speed up product search and filtering, and a further migration refactored the payment ↔ order relationship (`V4__refactor_payment_order_link.sql`) as the checkout flow matured.

## API Overview

**Auth**
```
POST /auth/register
POST /auth/login                 # short-lived access token
POST /auth/login/tokens          # access + refresh token pair
POST /auth/refresh
```

**Products**
```
GET  /products?page=0&size=10&sort=price,desc
GET  /products?category=Accessories&minPrice=100&maxPrice=1000
GET  /products/search?keyword=flower&page=0&size=10
GET  /products/{id}
POST/PUT/DELETE /products/admin/**    # admin-only
```

**Cart & Wishlist**
```
GET/POST/DELETE /cart, /cart/add, /cart/remove/{id}, /cart/total
GET/POST/DELETE /wishlist, /wishlist/add, /wishlist/remove/{id}
```

**Orders & Payments**
```
POST /orders/checkout
GET  /orders
POST /payment/verify
```

**Admin**
```
GET /admin/stats
GET /admin/orders
GET /admin/orders/{username}
```

Full interactive documentation is available via Swagger UI once the backend is running (`/swagger-ui.html`).

## Security & Reliability

- Passwords are hashed with BCrypt; plaintext passwords are never stored
- Protected endpoints require a valid JWT access token in the `Authorization: Bearer` header; refresh tokens are rejected by protected API endpoints
- Auth endpoints are IP-rate-limited to blunt brute-force login/registration attempts
- Checkout and stock updates are wrapped in `@Transactional` methods to prevent partial writes under concurrent orders
- Payment confirmation requires Razorpay signature verification before an order is marked paid
- Role checks (USER / ADMIN) are enforced server-side on every protected endpoint, not just hidden in the UI

## Getting Started

### Prerequisites
- Java 17, Maven
- PostgreSQL
- Node.js (for the frontend)

### Backend

```bash
export DATABASE_URL='jdbc:postgresql://localhost:5432/crochet_store'
export DB_USERNAME='postgres'
export DB_PASSWORD='your-password'
export JWT_SECRET='a-long-random-secret-with-at-least-32-characters'

mvn spring-boot:run
```

Razorpay credentials are optional at startup, required for payment features:

```bash
export RAZORPAY_KEY_ID='rzp_test_...'
export RAZORPAY_KEY_SECRET='...'
```

Flyway applies all schema migrations automatically on startup.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Testing

```bash
mvn test
mvn -DskipTests package
```

## Deployment

- Backend runs on Render; `render.yaml` provisions the web service and a managed PostgreSQL database
- Frontend is deployed on Vercel
- Environment variables configure the database connection, JWT secret, Razorpay keys, and allowed CORS origins

## Planned Improvements

- Redis-backed distributed rate limiting (current implementation is in-memory, single-instance only)
- Order status webhooks / email notifications
- Product reviews and ratings
- Bulk product import for admins

## Author

**Afreen Ali**
[LinkedIn](https://linkedin.com/in/afreen1808) · [GitHub](https://github.com/Fareen1808)
