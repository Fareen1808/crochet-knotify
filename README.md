# Crochet Store Backend

Spring Boot 3 / Java 17 backend for the Crochet Store application. It uses PostgreSQL, Flyway migrations, JWT authentication, Razorpay integration, Caffeine caching, and OpenAPI documentation.

Requirements: Java 17, Maven, and PostgreSQL.

Create a database named `crochet_store`, then configure environment variables before starting:

```powershell
$env:DATABASE_URL='jdbc:postgresql://localhost:5432/crochet_store'
$env:DB_USERNAME='postgres'
$env:DB_PASSWORD='your-password'
$env:JWT_SECRET='a-long-random-secret-with-at-least-32-characters'
mvn spring-boot:run
```

Razorpay credentials are optional for application startup, but are required to create or verify payments:

```powershell
$env:RAZORPAY_KEY_ID='rzp_test_...'
$env:RAZORPAY_KEY_SECRET='...'
```

## Database migrations

Flyway runs automatically at startup. New databases receive the schema from `V1__initial_schema.sql` and indexes from `V2__add_query_indexes.sql`.

For an existing database created by earlier Hibernate versions, Flyway baselines it at version 1 and then applies later migrations. Hibernate validates the schema and never performs automatic schema updates.

## Authentication

`POST /auth/login` continues to return a plain 15-minute access token for compatibility.

For refresh-token support:

```text
POST /auth/login/tokens?username={username}&password={password}
POST /auth/refresh?refreshToken={refreshToken}
```

The token-pair response contains a 15-minute `accessToken`, a 7-day `refreshToken`, `tokenType`, and `expiresIn`. Refresh tokens are rejected by protected API endpoints; send access tokens as `Authorization: Bearer {accessToken}`.

## Products

```text
GET /products?page=0&size=10&sort=price,desc
GET /products?category=Accessories&minPrice=100&maxPrice=1000
GET /products/search?keyword=flower&page=0&size=10
```

Supported sort fields are `id`, `name`, and `price`.

## Tests

```bash
mvn test
mvn -DskipTests package
```

JWT unit tests run without external services. Run the application against a PostgreSQL database to verify database migrations and HTTP flows before deployment.
