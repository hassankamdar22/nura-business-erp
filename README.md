# Nura Business ERP — Standalone

Standalone ERP. Shopify integration has been completely removed.

## Login
The ERP uses its own email/password login. Set `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `.env`. The first server start creates the admin user automatically.

## Modules
Dashboard, Orders, Inventory, Customers, Expenses, Udhar/Khata, Production Costing, Vendor Payments, Invoices/Receipts, Reports/P&L, Settings and PWA/mobile UI.

## Deploy
Requires Node.js and PostgreSQL. Set the environment variables, run `npm install`, then `npm start`.

For Railway, deploy this project as a Node.js service and add a PostgreSQL service. Copy the PostgreSQL `DATABASE_URL` into the ERP service variables, then set `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `PORT`.

After deployment, open the generated public domain. Later you can point `erp.nurafashion.com` to that domain.

Never publish `.env` or share the admin password/JWT secret.
