# CLAUDE.md — E-App Project Guide

## Project Overview
React CRA single-page app — login + dashboard with product management, cart, orders, invoices, and payments.

## Dev Server
```bash
npm start        # http://localhost:3000
npm run build    # production build
```

## Default Login Credentials
- Email: `Test@test.com`
- Password: `test@12345` (8–10 characters)

## Key Files
| File | Purpose |
|---|---|
| `src/components/LoginPage.js` | Login form, validation, password toggle |
| `src/components/Dashboard.js` | All dashboard tabs, cart, orders, payment logic |
| `src/components/Dashboard.css` | All styles |
| `src/components/data.js` | Seed data — products, orders, invoices, payments |

## Data Model
Products have: `id, name, quantity, stock, price, discount (%), description, image`
- `finalPrice(p)` helper computes `price * (1 - discount/100)`
- Cart stores `cartPrice` (final discounted price) at time of add-to-cart

## Git / GitHub
- Repo: `https://github.com/narsimha-mw/React-MyApp_PWA`
- Branch: `main`
- Remote token auth: stored in remote URL (PAT)
- No `gh` CLI — use `curl` with GitHub REST API for PR/merge operations

## Important Conventions
- All prices display in Indian Rupee (₹)
- Profile location: Bangalore, India | Phone: +91 1234567890
- App branding: **E-App** (not MyApp or E MyApp)
- Static seed data lives in `data.js` — do not inline in `Dashboard.js`

## Cache Issues
If DOM does not reflect file changes after save:
```bash
npx kill-port 3000
rm -rf node_modules/.cache
npm start
```

## Libraries
- `jsPDF` — PDF invoice download
- `xlsx` (SheetJS) — Excel export (orders) and bulk CSV/Excel import
