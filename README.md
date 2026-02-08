# UI E2E Tests — Playwright & TypeScript

## Project description

End-to-end UI test suite for the **KIB Shopify demo store**. Built with Playwright and TypeScript, it covers:

- **Login** — Valid/invalid password flows
- **Products** — Product list and product lookup
- **Card** — Add to cart and “Buy now” to checkout
- **Checkout** — Order submit and field validation

Tests run across **Chromium**, **Firefox**, and **WebKit** using the Page Object Model for maintainability. Reports and traces are generated for debugging and CI.

---

## Prerequisites

- **Node.js** 18 or later
- **npm** or **pnpm**
- Network access to the demo store base URL (see `playwright.config.ts`)

---

## Environment setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Install Playwright browsers (one-time):**
   ```bash
   npx playwright install
   ```

3. **(Optional)** Set environment variables:
   - `HEADLESS=false` — run tests with browser visible
   - `CI=true` — enable CI mode (retries, single worker, etc.)

After this, the project is ready to run (see [Running the project](#running-the-project)).

---

## Running the project

End-to-end flow: install → run tests → view report.

1. **Run all tests (headless):**
   ```bash
   npm test
   ```

2. **Run with browser visible:**
   ```bash
   npm run test:headed
   ```

3. **Run in Playwright UI mode:**
   ```bash
   npm run test:ui
   ```

4. **Open the last HTML report:**
   ```bash
   npm run report
   ```

**Other useful commands:**

| Command | Description |
|--------|-------------|
| `npx playwright test tests/login.spec.ts` | Run a single test file |
| `npx playwright test --project=chromium` | Run Chromium only |
| `HEADLESS=false npm test` | Run all tests in headed mode |

---

## Tests

| Flow | Coverage |
|------|----------|
| **Login** | Valid password shows products; invalid password shows error containing "incorrect". |
| **Products** | Product list visible after login; `getProduct` throws for missing product. |
| **Card** | "Buy now" opens checkout page. |
| **Checkout** | Submit order shows payment error banner; missing required fields (email, lastName, address, postal, city, phone, state) show expected validation messages. |

**Reports**

- **HTML report** — `playwright-report/index.html`. Open with `npm run report`.
- **Traces** — On first retry, traces are saved under `test-results/` and can be opened from the HTML report or via `npx playwright show-trace <path>`.

---

## Project structure

```
├── pages/                 # Page Object classes
│   ├── LoginPage.ts
│   ├── ProductsPage.ts
│   ├── CardPage.ts
│   └── CheckoutPage.ts
├── tests/                 # Test specifications
│   ├── login.spec.ts
│   ├── products.spec.ts
│   ├── card.spec.ts
│   └── checkout.spec.ts
├── playwright.config.ts   # Playwright config (baseURL, projects, reporters)
├── playwright-report/     # HTML report (generated after test run)
├── tsconfig.json
└── package.json
```

---

## Reference

- [Playwright documentation](https://playwright.dev/docs/intro)
- [Playwright Test](https://playwright.dev/docs/test)
- [TypeScript](https://www.typescriptlang.org/docs/)
- [Node.js](https://nodejs.org/docs/)
