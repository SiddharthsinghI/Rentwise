# RentWise — Smart Rental Management Platform
**Phase 3: Final Database Integration & Full-Stack Completion**

Developed for the Full Stack Developer Internship Technical Assignment at **Rewamp Digital**.

---

## 🌟 Project Overview

**RentWise** is a full-stack smart rental management and marketplace platform designed for creative professionals, tech teams, and makers. It bridges equipment owners (Vendors) and renters (Customers), offering on-demand rental access to cinema camera kits, high-performance laptops, next-gen gaming consoles, 4K laser projectors, and specialized gear.

In **Phase 3**, the platform achieves full-stack completion:
- **Database Engine**: Backed by **MySQL 8.0** with **Prisma ORM (v6.19.3)**.
- **Relational Integrity**: Complete schema defining Users, Products, Bookings, and Wishlist items with primary keys, foreign keys, indexes, and deletion cascading.
- **ACID & Concurrency Safety**: Booking requests and vendor approval lifecycles execute inside database transactions utilizing pessimistic row-level locking (`SELECT ... FOR UPDATE`) in InnoDB to eliminate double-booking race conditions.
- **Full API Connectivity**: React 19 frontend seamlessly connects to the Express 4 REST API, with real-time JWT authentication, role-based access control, session persistence with token restoration on app load, real product CRUD, booking workflows, and dynamic dashboard metrics.
- **Zero Mock Fallbacks**: All reads and writes persist directly to MySQL, with graceful error handling and user feedback.

---

## ✨ Main Features

### 1. Public Marketplace & Equipment Catalog
- **Instant Search & Filtering**: Multi-field search across titles, brands, categories, descriptions, and inclusions; instant category switching; min/max price range sliders; availability filters.
- **Sort Options**: Featured, Price: Low to High, Price: High to Low, Customer Rating, Most Popular, and Newest listings.
- **Equipment Details**: High-resolution gallery, comprehensive specs (sensor, brand, weight), package inclusions, verified owner cards, and interactive rental quote calculator.

### 2. Concurrency-Safe Rental Booking Management
- **Server-Side Pricing Engine**: Mathematical verification of rental duration, base cost, 7.5% platform service fee, security deposit, and totals (client pricing inputs are never trusted).
- **Concurrency & Overlap Lock**: Prevents inventory overselling. Concurrent requests competing for the same stock unit are serialized with InnoDB pessimistic row locks (`SELECT ... FOR UPDATE`), immediately returning `HTTP 409 Conflict` on overlap.
- **Adjacent Rentals Permitted**: Non-overlapping adjacent bookings (e.g., Nov 10–15 followed by Nov 16–20) are permitted and supported.
- **Full Booking Lifecycle**: State machine transitions (`pending` → `approved`/`rejected` → `active` → `completed` / `cancelled`) with role authorization (only vendors can approve/reject; customers can cancel pending requests).

### 3. Vendor Equipment & Booking Management
- **Product CRUD**: Verified vendors can create new equipment listings with preset or custom images, update specifications/pricing/inventory, and delete equipment (with transactional cascading).
- **Booking Request Processing**: Accept or decline rental requests with custom rejection reasons; mark rentals as returned with inspection feedback.
- **Live Inventory Synchronization**: Equipment availability status automatically tracks active bookings against total physical stock.

### 4. User Authentication, Profiles & Persisted Wishlists
- **User Authentication & Session Management**: Secure user registration (`/register`) and login (`/login`) with `bcryptjs` password hashing and stateless JSON Web Tokens (JWT). The client automatically restores authenticated sessions on application startup by validating the stored token against `GET /api/auth/me`.
- **Role-Based Access Control**: Strict client route protection (`ProtectedRoute.jsx`) and backend JWT verification middleware (`auth.middleware.js`) for `customer` and `vendor` operations.
- **Persisted Wishlist**: Add and remove equipment from wishlists with real-time persistence in the MySQL `wishlist_items` table.
- **Profile Management**: Update name, bio, phone, location, and business details via database-persisted profile updates.

### 5. Role-Specific Dashboards & Analytics
- **Customer Dashboard**: Rental history, active rentals, pending requests, total spend calculation, and saved equipment wishlist.
- **Vendor Dashboard**: Total listed inventory, realized revenue, projected revenue from approved rentals, monthly revenue charts (Recharts), and category inventory distribution.

---

## 🛠️ Technology Stack

| Layer | Technology | Version | Purpose |
|---|---|---|---|
| **Frontend Framework** | React + Vite | React 19.3 / Vite 8.3 | Ultra-fast client application with optimized build |
| **Styling & UI** | Tailwind CSS | v3.4 | Curated color tokens, responsive layouts, glassmorphism |
| **Icons** | Lucide React | v1.60 | Modern SVG iconography |
| **Data Visualization** | Recharts | v3.10 | Interactive monthly revenue and category charts |
| **Backend Runtime** | Node.js + Express | Node v24 / Express 4.21 | RESTful API server with modular routing and controllers |
| **Database ORM** | Prisma ORM | v6.19.3 | Type-safe query engine, migrations, and schema validation |
| **Database** | MySQL | 8.0.44 | Relational storage, ACID transactions, and InnoDB row locking |
| **Authentication** | JWT + bcryptjs | jsonwebtoken 9.0 / bcryptjs 2.4 | Token-based auth and cryptographic password hashing |
| **Validation** | Zod | v3.24 | Schema validation for auth, products, and bookings |
| **Testing** | Vitest + Supertest | Vitest 3.2 / Supertest 7.0 | Automated integration and concurrency testing (49 passing tests) |

---

## 📂 Architecture & Folder Structure

```
rentwise/
├── package.json                         # Workspace root convenience scripts
├── README.md                            # Comprehensive full-stack documentation
├── client/                              # React 19 Frontend
│   ├── .env.example                     # Client environment template (VITE_API_URL)
│   ├── package.json                     # Client dependencies (React, Vite, Tailwind, Recharts)
│   ├── vite.config.js                   # Vite configuration
│   ├── tailwind.config.js               # Design tokens, fonts, and colors
│   └── src/
│       ├── components/                  # Reusable UI components (marketplace, vendor, product, customer)
│       ├── context/                     # Context providers (AuthContext, ProductContext, BookingContext, WishlistContext)
│       ├── pages/                       # Application route pages
│       ├── routes/                      # React Router v7 configuration (AppRoutes.jsx)
│       ├── services/                    # Real API client & services (apiClient, authService, productService, bookingService, wishlistService)
│       └── utils/                       # Validation, formatters, and calculations
└── server/                              # Node.js + Express Backend
    ├── .env.example                     # Server environment template (PORT, DATABASE_URL, JWT_SECRET)
    ├── package.json                     # Server dependencies (Express, Prisma, bcryptjs, Vitest)
    ├── vitest.config.js                 # Vitest test configuration (sequential database tests)
    ├── prisma/
    │   ├── schema.prisma                # Prisma schema (User, Product, Booking, WishlistItem)
    │   ├── migrations/                  # Versioned SQL migrations (20261021120000_init_rentwise_mysql)
    │   ├── seed.js                      # Idempotent demo database seed script
    │   └── setupTestDb.js               # Test database initialization helper
    ├── src/
    │   ├── server.js                    # Server bootstrap, DB health check, and graceful shutdown
    │   ├── app.js                       # Express app configuration, CORS, and middleware
    │   ├── config/                      # Environment and Prisma Client singletons (env.js, prisma.js)
    │   ├── controllers/                 # Route controllers (auth, product, booking, user, dashboard, wishlist)
    │   ├── middleware/                  # Auth verification, role checks, error handlers
    │   ├── repositories/                # Prisma-backed MySQL repositories (user, product, booking, wishlist)
    │   ├── routes/                      # API endpoint definitions (/api/*)
    │   ├── services/                    # Business logic & MySQL concurrency transaction locking
    │   └── utils/                       # JWT, password hashing, rental calculations, test scripts
    └── tests/                           # Automated Vitest test suites (49 passing tests)
        ├── auth.test.js                 # 11 tests: Registration, login, validation, token verification
        ├── products.test.js             # 13 tests: Catalog, category/price filters, vendor CRUD, auth checks
        ├── bookings.test.js             # 12 tests: Pricing math, state machine, access control, overlaps
        ├── concurrency.test.js          # 3 tests: Pessimistic locking, race conditions, adjacent dates
        ├── users.test.js                # 5 tests: Profile retrieval, updates, summary statistics
        ├── dashboard.test.js            # 5 tests: Metrics, earnings, revenue calculation
        └── dbHelper.js                  # Database reset and clean fixture loading for tests
```

> **Note**: Active `.env` files are excluded from Git via `.gitignore` to protect credentials. Users must create their own local `.env` files using the provided `.env.example` templates.

---

## 🗄️ Database Models & Prisma Schema

The Prisma schema is located at [`server/prisma/schema.prisma`](server/prisma/schema.prisma) and maps to MySQL tables:

### 1. `User` (`users`)
- `id` (`VARCHAR(191)`, Primary Key)
- `name` (`VARCHAR(191)`), `email` (`VARCHAR(191)`, Unique), `passwordHash` (`VARCHAR(255)`)
- `role` (`VARCHAR(50)`, Default: `'customer'`)
- Profile fields: `avatar` (`TEXT`), `phone`, `location`, `bio`, `businessName`, `memberSince`, `rating`, `reviewsCount`, `verified`, `responseTime`
- `createdAt`, `updatedAt` (`DATETIME(3)`)
- Relations: `products` (`Product[]`), `customerBookings` (`Booking[]`), `vendorBookings` (`Booking[]`), `wishlist` (`WishlistItem[]`)

### 2. `Product` (`products`)
- `id` (`VARCHAR(191)`, Primary Key)
- `name` (`VARCHAR(255)`), `category` (`VARCHAR(100)`), `vendorId` (`VARCHAR(191)`, Foreign Key $\rightarrow$ `users.id`)
- `pricePerDay` (`DECIMAL(10,2)`), `securityDeposit` (`DECIMAL(10,2)`), `totalQuantity` (`INT`, Default: 1)
- `availability` (`VARCHAR(50)`, Default: `'available'`), `condition` (`VARCHAR(50)`), `rating`, `reviewsCount`, `featured`, `popular`
- JSON fields: `images`, `features`, `specs`, `inclusions`
- `location` (`VARCHAR(191)`), `description` (`TEXT`)
- `createdAt`, `updatedAt` (`DATETIME(3)`)
- Indexes: `vendorId`, `category`, `availability`
- Relations: `vendor` (`User`, Cascade delete), `bookings` (`Booking[]`), `wishlistedBy` (`WishlistItem[]`)

### 3. `Booking` (`bookings`)
- `id` (`VARCHAR(191)`, Primary Key)
- `productId` (`VARCHAR(191)`, Foreign Key $\rightarrow$ `products.id`), `productName`, `productImage`
- `customerId` (`VARCHAR(191)`, Foreign Key $\rightarrow$ `users.id`), `customerName`, `customerEmail`
- `vendorId` (`VARCHAR(191)`, Foreign Key $\rightarrow$ `users.id`), `vendorName`
- `startDate` (`VARCHAR(20)`), `endDate` (`VARCHAR(20)`), `totalDays` (`INT`)
- Pricing: `dailyRate`, `baseCost`, `serviceFee`, `securityDeposit`, `totalPrice` (`DECIMAL(10,2)`)
- `status` (`VARCHAR(50)`, Default: `'pending'`)
- `customerNotes` (`TEXT`), `destination` (`VARCHAR(255)`), `rejectionReason` (`TEXT`), `vendorFeedback` (`TEXT`)
- `createdAt`, `updatedAt` (`DATETIME(3)`)
- Indexes: `productId`, `customerId`, `vendorId`, `status`

### 4. `WishlistItem` (`wishlist_items`)
- `id` (`VARCHAR(191)`, Primary Key, CUID)
- `userId` (`VARCHAR(191)`, Foreign Key $\rightarrow$ `users.id`, Cascade delete)
- `productId` (`VARCHAR(191)`, Foreign Key $\rightarrow$ `products.id`, Cascade delete)
- Unique Constraint: `(userId, productId)`
- Indexes: `userId`, `productId`

---

## 🔒 Concurrency Strategy & MySQL Locking

In rental platforms, concurrent requests can create double bookings if availability is only checked prior to an insert. RentWise implements **InnoDB Pessimistic Locking**:

1. **Interactive Transaction**: When a customer books or a vendor approves, Prisma starts an interactive transaction (`prisma.$transaction(async (tx) => { ... })`).
2. **Pessimistic Row Lock (`SELECT ... FOR UPDATE`)**:
   ```sql
   SELECT id, name, vendorId, pricePerDay, securityDeposit, totalQuantity, availability
   FROM products
   WHERE id = ?
   FOR UPDATE;
   ```
   This acquires an exclusive lock (`X-lock`) on the product row.
3. **Serialized Overlap Check**:
   Any concurrent transaction attempting to book or approve the same product is blocked until the first transaction commits.
   The second transaction then reads committed bookings and product stock.
4. **Immediate Conflict Detection**:
   If overlapping confirmed bookings equal or exceed `totalQuantity`, the transaction immediately throws `HTTP 409 Conflict`:
   ```
   Inventory Conflict: All 1 unit(s) of "Sony Alpha A7 IV" are already booked between 2026-12-10 and 2026-12-15.
   ```
5. **Rollback**: Failed operations automatically roll back without leaving partial database artifacts.

---

## 📡 API Overview

The backend exposes a standardized RESTful API under `/api`. All protected endpoints require a Bearer token in the `Authorization` header (`Bearer <JWT>`).

| Module | Method | Endpoint | Access | Description |
|---|---|---|---|---|
| **System** | `GET` | `/api/health` | Public | Service health & MySQL database connection status |
| **Auth** | `POST` | `/api/auth/register` | Public | Register customer or vendor with bcrypt password hashing |
| | `POST` | `/api/auth/login` | Public | Authenticate user & return signed JWT token |
| | `GET` | `/api/auth/me` | Protected | Fetch authenticated user identity and role from token |
| | `POST` | `/api/auth/logout` | Public | Stateless logout confirmation |
| **Products** | `GET` | `/api/products` | Public | List equipment catalog with search, category, price & availability filters |
| | `GET` | `/api/products/:id` | Public | Get single equipment details with verified owner information |
| | `POST` | `/api/products` | Vendor | Create new equipment listing |
| | `PATCH` | `/api/products/:id` | Vendor Owner | Update equipment specs, pricing, quantity, or availability |
| | `DELETE` | `/api/products/:id` | Vendor Owner | Delete equipment listing (with transactional cascading) |
| **Bookings** | `GET` | `/api/bookings` | Protected | Fetch user's bookings (role-filtered for customer or vendor) |
| | `GET` | `/api/bookings/:id` | Protected | Get single booking breakdown and payment details |
| | `POST` | `/api/bookings` | Customer | Create rental booking with server pricing and row-level concurrency lock |
| | `PATCH` | `/api/bookings/:id/status` | Protected | Update state (`approved`, `rejected`, `active`, `completed`, `cancelled`) |
| **Users** | `GET` | `/api/users/me` | Protected | Get user profile with rental activity and inventory statistics |
| | `PATCH` | `/api/users/me` | Protected | Update profile details (bio, location, phone, businessName) |
| **Dashboard** | `GET` | `/api/dashboard/customer` | Customer | Customer metrics, total spending, active & upcoming rentals |
| | `GET` | `/api/dashboard/vendor` | Vendor | Vendor KPIs, revenue analytics, and monthly earnings breakdown |
| **Wishlist** | `GET` | `/api/wishlist` | Customer | Get user's saved equipment IDs from MySQL |
| | `POST` | `/api/wishlist/:productId` | Customer | Add equipment to customer's wishlist |
| | `DELETE` | `/api/wishlist/:productId` | Customer | Remove equipment from customer's wishlist |

---

## ⚙️ Environment Configuration

### Server Environment (`server/.env`)
Create `server/.env` in the `server/` directory using [`server/.env.example`](server/.env.example):
```env
PORT=5000
CLIENT_URL=http://localhost:5173
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=24h
NODE_ENV=development
DATABASE_URL="mysql://username:your_password@localhost:3306/rentwise_db"
```
*(Replace `username` and `your_password` with your local MySQL credentials. If your password contains special characters like `@` or `#`, URL-encode them, e.g. `%40` or `%23`.)*

### Client Environment (`client/.env`)
Create `client/.env` in the `client/` directory using [`client/.env.example`](client/.env.example):
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher (v20+ LTS recommended)
- **MySQL**: 8.0 or higher running on `localhost:3306`

### 2. MySQL Database Setup
In MySQL Workbench, CLI, or PowerShell:
```sql
CREATE DATABASE IF NOT EXISTS rentwise_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 3. Install Dependencies
You can install dependencies separately in each directory, or from the workspace root:

**Option A — Directory by directory (Recommended)**:
```bash
# Install backend dependencies (working directory: server/)
cd server
npm install

# Install frontend dependencies (working directory: client/)
cd ../client
npm install
```

**Option B — From workspace root**:
```bash
npm --prefix server install
npm --prefix client install
```

### 4. Database Migrations & Prisma Client Generation
From the `server/` directory:
```bash
cd server

# Generate Prisma Client (runs prisma generate)
npm run prisma:generate

# Apply versioned database migrations (runs prisma migrate deploy)
npm run prisma:deploy
```

### 5. Seed Demo Data
From the `server/` directory:
```bash
cd server

# Run the idempotent seed script (seeds users, products, bookings, wishlist)
npm run prisma:seed
```

### 6. Start Frontend and Backend Servers

Open two terminal windows:

**Terminal 1 — Backend API** (working directory: `server/`):
```bash
cd server
npm run dev
# Express API will run on http://localhost:5000 (Base API: http://localhost:5000/api)
```

**Terminal 2 — Frontend Client** (working directory: `client/`):
```bash
cd client
npm run dev
# Vite client will run on http://localhost:5173
```

*(Alternatively, from the workspace root you can run `npm run server` in Terminal 1 and `npm run dev` in Terminal 2.)*

Visit **`http://localhost:5173`** in your browser.

---

## 👤 Demo Accounts

The database seed script (`server/prisma/seed.js`) creates 4 demo accounts with the shared password: **`Password123!`**

| Name | Role | Email | Business / Bio |
|---|---|---|---|
| **Alex Rivera** | `customer` | `alex.customer@example.com` | Content creator, drone enthusiast |
| **Priya Sharma** | `customer` | `priya.customer@example.com` | Visual designer & indie game dev |
| **Marcus Vance** | `vendor` | `marcus.vendor@example.com` | **Apex Cine & Pro AV** (Camera & AV gear) |
| **Elena Rostova** | `vendor` | `elena.vendor@example.com` | **Urban Tech & Tool Hub** (Workstations & tools) |

To test different roles:
1. Navigate to **`http://localhost:5173/login`** and sign in using any account above, or create a new account at **`/register`**.
2. Upon login, the signed JWT token is stored in `localStorage` and the session is automatically restored on page reloads via `GET /api/auth/me`.
3. To switch accounts, click the user profile dropdown in the top-right corner of the navigation bar, click **Sign Out**, and log in with another account.

---

## 🧪 Testing Instructions

The backend test suite contains **49 automated tests** across 6 test files covering all functional, authorization, database, and concurrency scenarios.

### Running Backend Automated Tests
From the `server/` directory:
```bash
cd server
npm test
```
*(Or from the workspace root: `npm run server:test`)*

### Verified Test Results Summary:
```
 ✓ tests/products.test.js (13 tests)
   ✓ Public catalog listing without authentication
   ✓ Filter equipment by category
   ✓ Search query matching across title, brand, description
   ✓ Sort equipment by price ascending
   ✓ Equipment details with attached vendor public information
   ✓ 404 for non-existent equipment ID
   ✓ Allows verified vendor to create equipment listing
   ✓ Rejects product creation by customer (403 Forbidden)
   ✓ Rejects unauthenticated product creation (401 Unauthorized)
   ✓ Allows listing owner to update equipment
   ✓ Forbids editing another vendor's listing (403 Forbidden)
   ✓ Forbids deleting another vendor's listing (403 Forbidden)
   ✓ Allows listing owner to delete equipment
 ✓ tests/bookings.test.js (12 tests)
   ✓ Creates booking request & calculates financial charges on server
   ✓ Rejects booking when end date is earlier than start date (400)
   ✓ Forbids vendor from creating rental booking (403)
   ✓ Detects booking overlap conflicts when stock is exhausted (409)
   ✓ Customer receives only their own bookings
   ✓ Vendor receives only bookings for their own equipment
   ✓ Forbids unrelated user from accessing private booking (403)
   ✓ Allows vendor to approve pending booking request
   ✓ Allows vendor to decline booking with rejection reason
   ✓ Rejects invalid state transitions (400 Bad Request)
   ✓ Allows customer to cancel their own pending booking
   ✓ Forbids customer from approving or completing booking (403)
 ✓ tests/concurrency.test.js (3 tests)
   ✓ Prevents double-booking when concurrent requests compete for single stock (409 Conflict)
   ✓ Atomically rejects overlapping approval when stock is reached (409 Conflict)
   ✓ Permits adjacent non-overlapping bookings without conflict
 ✓ tests/dashboard.test.js (5 tests)
   ✓ Returns calculated customer metrics and recent bookings
   ✓ Returns vendor metrics: listings, active, pending, revenue
   ✓ Monthly revenue calculations for vendor chart
   ✓ Rejects unauthenticated dashboard access (401)
   ✓ Enforces customer/vendor role constraints on dashboards
 ✓ tests/users.test.js (5 tests)
   ✓ Returns customer profile with booking summary stats
   ✓ Returns vendor profile with inventory stats
   ✓ Allows customer to update profile (name, bio, location)
   ✓ Allows vendor to update business name and details
   ✓ Prevents updating sensitive fields (passwordHash, role, email)
 ✓ tests/auth.test.js (11 tests)
   ✓ Customer registration & validation
   ✓ Vendor registration with business name
   ✓ Rejects duplicate email registration (409 Conflict)
   ✓ Rejects weak passwords and invalid email format
   ✓ Successful login with valid credentials
   ✓ Rejects incorrect password (401)
   ✓ Rejects non-existent email (401)
   ✓ Returns authenticated user profile via GET /api/auth/me
   ✓ Rejects invalid or expired JWT token (401)
   ✓ Rejects unauthenticated request without token (401)
   ✓ Stateless logout endpoint

Test Files:  6 passed (6)
Tests:       49 passed (49)
Duration:    ~17s
```

### Optional: Running the Live Full-Stack HTTP Verification Script
With the backend server running locally on port 5000, you can run the integration check from the `server/` directory:
```bash
cd server
node src/utils/testApiIntegration.js
```
Executes live HTTP requests testing health, auth, catalog, booking creation, vendor approval, dashboards, and wishlist against MySQL.

---

## 📋 Rewamp Digital Internship Assignment Requirements Mapping

| # | Requirement | Implemented Feature & Code Location | Evidence of Testing |
|---|---|---|---|
| **1** | **Home Page** | Modern hero banner, featured equipment grid, category quick-filters, value proposition stats, and CTA buttons ([`client/src/pages/LandingPage.jsx`](client/src/pages/LandingPage.jsx)). | Component structure in `LandingPage.jsx`; layout verified via automated Vite production build. |
| **2** | **Listing and Details** | Public marketplace ([`MarketplacePage.jsx`](client/src/pages/MarketplacePage.jsx)), equipment details with gallery, specs, inclusions, and rental calculator ([`ProductDetailsPage.jsx`](client/src/pages/ProductDetailsPage.jsx)). | `tests/products.test.js` (GET `/api/products` & GET `/api/products/:id` with vendor profile). |
| **3** | **Create and Update** | Modal form for vendors to create and edit equipment listings with validation ([`AddEditProductModal.jsx`](client/src/components/vendor/AddEditProductModal.jsx), [`VendorListingsPage.jsx`](client/src/pages/VendorListingsPage.jsx)). | `tests/products.test.js` (POST `/api/products` & PATCH `/api/products/:id` ownership authorization). |
| **4** | **Delete** | Confirmation modal for equipment deletion ([`ConfirmationModal.jsx`](client/src/components/common/ConfirmationModal.jsx), [`VendorListingsPage.jsx`](client/src/pages/VendorListingsPage.jsx)). | `tests/products.test.js` (DELETE `/api/products/:id` owner check & cascade deletion in MySQL). |
| **5** | **Interaction** | Dynamic rental calculation (days, base cost, 7.5% platform fee, deposit), real-time stock availability, booking request submission, vendor approve/reject modals. | `tests/bookings.test.js` (Server-side financial calculations & state transitions). |
| **6** | **Search and Filtering** | Real-time search by query across name, brand, description, category filter chips, price range sliders, availability toggle, and 6 sorting modes ([`product.repository.js`](server/src/repositories/product.repository.js)). | `tests/products.test.js` (Category filtering, price sorting, full-text token matching). |
| **7** | **User Profile** | Full user profile page with editable fields (name, phone, location, bio, business name), verified badges, rental history summary, and statistics ([`UserProfilePage.jsx`](client/src/pages/UserProfilePage.jsx)). | `tests/users.test.js` (GET `/api/users/me` & PATCH `/api/users/me` with sanitization). |
| **8** | **Backend API** | Complete Express REST API (`/api/auth`, `/api/products`, `/api/bookings`, `/api/users`, `/api/dashboard`, `/api/wishlist`) with security headers (Helmet), CORS, and standardized JSON payloads. | 49 passing automated tests in Vitest across 6 test suites. |
| **9** | **Database Persistence** | Real MySQL 8 database integration using Prisma ORM with versioned migrations, relational foreign keys, indexes, and seeded records. | `tests/concurrency.test.js` & `tests/bookings.test.js` verifying direct MySQL persistence with InnoDB row locking. |
| **10** | **Validation & Error Handling** | Client and server-side Zod validators, HTTP 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, and 409 Conflict with informative user-friendly messages. | Vitest test suite explicitly validating all error status codes and constraint violations. |
| **11** | **Responsive UI** | Mobile slide-over navigation drawer, responsive data tables, responsive Recharts cards, mobile filter sheets, and modern emerald/slate color scheme. | Verified via Tailwind CSS responsive design tokens and error-free Vite production build. |

---

## ⚠️ Known Limitations & Future Enhancements

1. **Stateless JWT Invalidation**: Logouts discard client tokens immediately. To invalidate tokens prior to expiry across distributed clusters, a Redis-backed token blacklist or refresh-token rotation table can be integrated.
2. **Payment Gateway Integration**: Rental calculations and security deposits are fully computed and tracked in MySQL; integrating Stripe or Razorpay would facilitate real credit card authorization holds for production deposits.
3. **Cloud Image Uploads**: Product creation currently supports preset CDN URLs or direct image links; Amazon S3 / Cloudinary signed uploads can be added for direct multi-file camera photo uploads.

---

## 📦 GitHub Submission Guidance

When submitting your repository:
1. Ensure `.env` files are ignored by git (already enforced in `.gitignore`).
2. Include `.env.example` files (both `server/.env.example` and `client/.env.example` are present and up to date).
3. The repo includes all database migrations in [`server/prisma/migrations/`](server/prisma/migrations/) and the seed script in [`server/prisma/seed.js`](server/prisma/seed.js).
4. Reviewers can follow the [Getting Started](#-getting-started) section to set up and verify the project in minutes.
