# EnCaveman - Online Food Ordering System

A full-stack online food ordering system built with **React (Vite)** and **Vercel Serverless Functions**. Customers can browse restaurants, select a branch, view queue-based wait times, add items to a cart, make demo payments, and track their order in real time. Admins can create restaurants, manage branches and menus, and update order statuses.

**Admin credentials:** `admin` / `root`

---

## Tech Stack

- **Frontend:** React 18, React Router v6, plain CSS
- **Backend:** Vercel Serverless Functions (Node.js)
- **State Management:** React Context API + localStorage
- **Build Tool:** Vite 5
- **Deployment:** Vercel

---

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

The app runs at `http://localhost:5173`. All data is persisted in the browser's localStorage so no database is needed for the demo.

To test with serverless API routes locally, install the Vercel CLI (`npm i -g vercel`) and run `vercel dev`.

---

## Project Structure & File Descriptions

### Root Configuration

| File | Description |
|---|---|
| `package.json` | Project metadata, dependencies (react, react-dom, react-router-dom), and npm scripts (`dev`, `build`, `preview`). |
| `vite.config.js` | Vite build configuration. Registers the React plugin for JSX support and fast refresh during development. |
| `vercel.json` | Vercel deployment configuration. Sets the build command (`npm run build`), output directory (`dist`), and URL rewrites — API routes are forwarded to serverless functions, all other routes fall back to `index.html` for client-side routing. |
| `index.html` | The single HTML entry point. Loads the Inter font from Google Fonts and mounts the React app from `/src/main.jsx` into the `#root` div. |
| `.gitignore` | Excludes `node_modules`, `dist`, `.DS_Store`, environment files, and `.vercel` from version control. |

---

### `src/` — Frontend Application

#### Entry Point

| File | Description |
|---|---|
| `src/main.jsx` | The application bootstrap file. Creates the React root, wraps the app in `BrowserRouter`, `AuthProvider`, and `CartProvider`, imports global styles, and renders `<App />`. |
| `src/App.jsx` | Defines the top-level layout and route table. Renders the `<Navbar />` on every page and maps URL paths to page components using React Router's `<Routes>` and `<Route>`. Routes: `/` (Home), `/restaurant/:id` (Restaurant detail), `/cart` (Checkout), `/order/:id` (Order tracking), `/admin` (Admin login), `/admin/dashboard` (Admin panel). |
| `src/index.css` | The single global stylesheet for the entire application. Contains CSS custom properties (design tokens for colors, shadows, radii, spacing), a CSS reset, and all component/page styles organized by section — navbar, hero, restaurant cards, menu items, branch selector, cart drawer, checkout page, payment modal, order tracker timeline, admin dashboard tables/forms, animations (fade, slide, spin, pulse), and responsive breakpoints for tablet and mobile. |

#### Data

| File | Description |
|---|---|
| `src/data/seedData.js` | Exports `seedRestaurants`, an array of 4 pre-configured restaurant objects (The Burger Joint, Sushi Master, Pizza Paradise, Taco Fiesta). Each restaurant has an `id`, `name`, `cuisine`, `description`, `rating`, `gradient` (CSS gradient for its card header), an array of `branches` (each with `id`, `name`, `address`, `queueCount`, `avgPrepTime`), and an array of `menu` items (each with `id`, `name`, `description`, `price`, `category`, `available`). This serves as the default dataset — admin-created restaurants are stored separately in localStorage. |

#### Context Providers (State Management)

| File | Description |
|---|---|
| `src/context/CartContext.jsx` | Manages the shopping cart using `useReducer` + `useContext`. **State:** array of cart items (each containing the menu item object and quantity), the current restaurant ID/name, and selected branch ID/name. **Actions:** `ADD_ITEM` (adds item or increments quantity; if switching restaurants, clears old items silently), `REMOVE_ITEM`, `UPDATE_QTY` (decrements/increments; removes item if quantity reaches zero), `SET_BRANCH`, `CLEAR`. Persists the entire cart to localStorage under the key `encaveman_cart` on every state change. Exposes `cart`, `total`, `itemCount`, `addItem`, `removeItem`, `updateQty`, `setBranch`, and `clearCart` to all child components via the `useCart()` hook. |
| `src/context/AuthContext.jsx` | Manages admin authentication state. Stores a boolean `isAdmin` flag. The `login(username, password)` function checks credentials against the hardcoded values (`admin` / `root`). On success, saves a demo token string to localStorage (`encaveman_admin_token`) and sets `isAdmin` to `true`. The `logout()` function clears the token. On app load, checks localStorage for an existing token to restore the session. Exposes `isAdmin`, `login`, and `logout` via the `useAuth()` hook. |

#### Components

| File | Description |
|---|---|
| `src/components/Navbar.jsx` | The fixed top navigation bar displayed on every page. Shows the "EnCaveman" brand logo, navigation links (Home, Admin — highlights the active route), and a Cart button that shows the current item count as a badge. Clicking the Cart button opens the `<CartDrawer />` overlay. Uses `useCart()` for item count and `useAuth()` to link to the dashboard or login page. |
| `src/components/RestaurantCard.jsx` | A clickable card used in the restaurant grid on the Home page. Displays the restaurant's gradient-colored header with its name, followed by the cuisine badge, star rating, branch count, a truncated description, and a "View Menu" button. Clicking anywhere on the card navigates to `/restaurant/:id`. |
| `src/components/MenuItemCard.jsx` | Renders a single menu item row on the restaurant page. Shows the item's name, description, and price on the left. On the right, displays either an "+ Add" button (if not in cart) or quantity controls (−/count/+) using `useCart()`. Items marked as unavailable are greyed out and non-interactive. |
| `src/components/BranchSelector.jsx` | A sidebar panel on the restaurant page for choosing a pickup branch. Lists all branches as clickable cards showing name, address, and a color-coded queue indicator (green for 0–2 orders, yellow for 3–4, red for 5+). The selected branch is highlighted. Below the list, displays the estimated wait time calculated as `(queueCount + 1) * avgPrepTime` minutes. Uses `useCart()` to read and set the selected branch. |
| `src/components/CartDrawer.jsx` | A slide-in side panel (from the right) that overlays the page. Shows the restaurant name and branch, a list of cart items with quantity controls (−/+), and a total. Has a "Proceed to Checkout" button that navigates to `/cart`. If the cart is empty, shows a placeholder message. The backdrop click or close button dismisses the drawer. |
| `src/components/PaymentModal.jsx` | A centered modal for the demo payment flow. Has three stages: **form** (pre-filled card details — number, expiry, CVV, cardholder name — with a "Demo Mode" badge), **processing** (a spinning loader for 2 seconds), and **success** (a green checkmark with a success message). After the success animation, calls `onSuccess()` which creates the order and redirects to the tracking page. No real payment processing occurs. |
| `src/components/OrderTracker.jsx` | Displays a vertical timeline/stepper that visualizes order progress through 5 stages: Order Placed → Confirmed → Preparing → Ready → Delivered. Completed steps show a green checkmark, the active step pulses with the primary color, and future steps are greyed out. Below the timeline, an ETA card shows the remaining estimated minutes calculated from the order's `createdAt` timestamp and `estimatedMinutes`. |

#### Pages

| File | Description |
|---|---|
| `src/pages/Home.jsx` | The landing page. Renders a hero section with a maroon gradient, headline ("Delicious Food, Delivered Fast"), and a search input. Below, a row of cuisine filter chips (All, American, Japanese, Italian, Mexican, plus any admin-created cuisines). Then a responsive grid of `<RestaurantCard />` components. Filters restaurants by search text (matches name or cuisine) and selected cuisine chip. Loads both seed data and any admin-created restaurants from localStorage. |
| `src/pages/RestaurantPage.jsx` | The detail page for a single restaurant (reached via `/restaurant/:id`). Shows a full-width header with the restaurant's gradient, name, description, cuisine, rating, and branch count. Below, a two-column layout: the left column has the `<BranchSelector />` (sticky on scroll), and the right column shows category tabs (e.g., Burgers, Sides, Drinks) that filter the menu items rendered as `<MenuItemCard />` rows. If the restaurant ID is invalid, shows a "not found" state with a link back to Home. |
| `src/pages/CartPage.jsx` | The checkout page. Two-column layout: left shows cart items with quantity controls, right shows the order form. The form includes name and phone inputs, a branch dropdown (auto-selects the first branch if none was chosen, shows queue count and ETA per option), an estimated wait time display, an itemized order summary with total, and a "Pay" button. Clicking Pay opens `<PaymentModal />`. On successful payment, creates an order object, saves it to localStorage (`encaveman_orders`), clears the cart, and navigates to `/order/:id`. If the cart is empty, shows a message with a link to browse restaurants. |
| `src/pages/OrderTracking.jsx` | Displays real-time order status for a specific order (reached via `/order/:id`). Loads the order from localStorage by ID. Renders the `<OrderTracker />` timeline on the left and order details (restaurant, branch, customer, itemized list, total) on the right. For demo purposes, the order status auto-advances every 8 seconds (pending → confirmed → preparing → ready → delivered) using `setTimeout`, updating localStorage each time. Shows a "not found" state if the order ID is invalid. |
| `src/pages/AdminLogin.jsx` | A centered login card with username and password fields. On submit, calls `login()` from `useAuth()`. If credentials are wrong, displays a red error banner. On success, redirects to `/admin/dashboard`. If already logged in, automatically redirects. Shows a hint at the bottom: "Demo credentials: admin / root". |
| `src/pages/AdminDashboard.jsx` | The admin management panel (protected — redirects to login if not authenticated). **Header:** shows 4 stat cards (total restaurants, custom restaurants, total orders, active orders) and a logout button. **Tabs:** Restaurants and Orders. **Restaurants tab:** a table listing all restaurants (seed + custom) with name, cuisine, branch count, and menu item count. Custom restaurants have "Manage" and "Delete" buttons. An "Add Restaurant" form lets the admin create a new restaurant (name, cuisine, description, rating) which is saved to localStorage. The "Manage" view expands inline forms to add/remove branches (name, address, prep time) and menu items (name, description, price, category), shown as removable chips. **Orders tab:** a table of all orders (polled from localStorage every 3 seconds) with order ID, customer, restaurant, total, a color-coded status badge, and an action button to advance the status to the next stage. |

---

### `api/` — Vercel Serverless Functions (Backend)

These files are deployed as serverless functions on Vercel. They provide a REST API that mirrors the frontend's localStorage-based functionality. Data is stored in-memory (resets on cold start).

| File | Endpoint | Methods | Description |
|---|---|---|---|
| `api/_lib/store.js` | *(internal module)* | — | Shared data store and helper functions used by all API routes. Contains the seed restaurant data (3 restaurants with branches and menus), an in-memory `orders` array, and exported functions: `getRestaurants`, `getRestaurant(id)`, `createRestaurant(data)`, `deleteRestaurant(id)`, `addMenuItem(restaurantId, item)`, `removeMenuItem(restaurantId, itemId)`, `getOrders`, `getOrder(id)`, `createOrder(data)`, `updateOrderStatus(id, status)`, and `verifyAdmin(req)` which checks the `Authorization: Bearer <token>` header. |
| `api/auth/login.js` | `POST /api/auth/login` | POST | Accepts `{ username, password }` in the request body. Returns `{ success: true, token }` if credentials match `admin`/`root`, or `401 { success: false, error }` otherwise. |
| `api/restaurants/index.js` | `/api/restaurants` | GET, POST | **GET:** Returns the full list of restaurants. **POST:** (admin-only, requires auth header) Creates a new restaurant with `{ name, cuisine, description, rating, gradient }`. Returns `400` if name or cuisine is missing. |
| `api/restaurants/[id]/index.js` | `/api/restaurants/:id` | GET, DELETE | **GET:** Returns a single restaurant by ID, or `404` if not found. **DELETE:** (admin-only) Removes the restaurant and returns `{ success: true }`. |
| `api/restaurants/[id]/menu.js` | `/api/restaurants/:id/menu` | GET, POST, DELETE | **GET:** Returns the menu array for a restaurant. **POST:** (admin-only) Adds a new menu item `{ name, description, price, category }`. **DELETE:** (admin-only) Removes a menu item by `{ itemId }` in the body. |
| `api/orders/index.js` | `/api/orders` | GET, POST | **GET:** Returns all orders (newest first). **POST:** Creates a new order with `{ restaurantId, restaurantName, branchId, branchName, items, total, estimatedMinutes, customerName, customerPhone }`. Sets status to `pending` and `paymentStatus` to `completed`. |
| `api/orders/[id].js` | `/api/orders/:id` | GET, PATCH | **GET:** Returns a single order by ID. **PATCH:** (admin-only) Updates the order status. Accepts `{ status }` where status must be one of: `pending`, `confirmed`, `preparing`, `ready`, `delivered`. |

---

## Application Flow

1. **Customer browses** the Home page, filters/searches restaurants, clicks one to view its menu.
2. **Selects items** from the menu using +/- controls. The cart tracks the restaurant automatically.
3. **Opens cart** (via navbar button or proceeds to `/cart`), fills in name and phone, picks a branch from the dropdown.
4. **Estimated wait** is shown based on the branch's queue: `(orders ahead + 1) x avg prep time`.
5. **Clicks Pay**, completes the demo payment flow (pre-filled card, 2s processing animation, success).
6. **Order is created** in localStorage and the customer is redirected to the tracking page.
7. **Order auto-progresses** through statuses every 8 seconds for demo purposes.
8. **Admin logs in** with `admin` / `root`, creates new restaurants with branches and menus, and manages order statuses from the dashboard.

---

## Deployment to Vercel

1. Push the repo to GitHub.
2. Import the project on [vercel.com](https://vercel.com).
3. Vercel auto-detects Vite, runs `npm run build`, serves `dist/` as static, and deploys `api/` as serverless functions.
4. No environment variables needed — the app is fully self-contained.
