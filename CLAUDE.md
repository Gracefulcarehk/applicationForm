# Graceful Care (滿心醫療) caregiver recruitment site

- `client/`: recruitment landing page, application form and thank-you page (https://apply.gracefulcarehk.com).
- `server/`: API that stores applications and emails a notification to the company (https://api.gracefulcarehk.com).

The main marketing site is the separate `web-app` repo (https://www.gracefulcarehk.com). The header, footer, colours and fonts here mirror that site; keep them aligned when either changes.

This repository is public. Never put secrets, connection strings, account IDs or infrastructure details in code, commits or docs.

## Working rules

- The owner writes in Cantonese; reply in Cantonese.
- Don't rewrite the project; make focused changes in the existing style.
- Don't install or upgrade packages without asking.
- Never run deployments or database migrations. Both sites deploy automatically from `master` after a PR is merged.
- Commit only when asked; push only after approval. Work on a branch, never on `master`. The owner opens and merges PRs on GitHub (no `gh` CLI), so give them the PR link, title and description.
- Commit as `Gracefulcarehk <gracefulcarehk@gmail.com>`, set with `git config --local` in each clone.
- Never read or print `.env*` files (other than `.env.example`), credentials or keys.
- Before running a project script, read what it does and explain it.
- Separate confirmed facts, guesses, and things the owner must confirm. A screen that renders is not a finished feature; verify it.

## Toolchain

- Node 22 and npm (`package-lock.json` in each package).
- Client (Create React App, MUI 5, Formik and Yup): `npx tsc --noEmit`, `CI=true npm test -- --watchAll=false`, `CI=true npm run build`. The Cloudflare build runs with `CI=true`, so lint warnings fail it.
- Server (Express, Mongoose, nodemailer, Cloudflare R2): `npm run typecheck`, `npm run lint`, `npm test`.
- The client needs `REACT_APP_API_URL` at build time; without it the page shows a blank screen. See `client/.env.example` and `server/.env.example` for variable names.
- There is no dev or staging environment. A local server with a real `.env` writes to the production database and storage and sends real emails, so delete any test applications afterwards.

## Code map

- `client/src/data/recruitment.ts`: all landing page copy (roles, requirements, steps, FAQ, WhatsApp link, review time). Change wording here, not in components. The benefits section stays hidden while `benefits` is empty.
- `client/src/theme.ts`: brand colours, fonts, breakpoints (`md` is 936px, matching the main site) and `HEADER_HEIGHT`.
- `client/src/components/layout/`: header and footer, matching the main site's navbar and footer.
- `client/src/components/landing/`: landing page sections; `client/src/pages/`: the three pages.
- `client/src/components/SupplierForm.tsx`: the application form, including the HKID check-digit validation.
- `server/src/models/supplierModel.ts`: `SUPPLIER_TYPES` (`HH`, `PCW`, `RN`, `AH`) and their labels. The role codes must match `roles` in `recruitment.ts`.
- `server/src/services/mailer.ts`: the notification email.

## Pending content

- The owner will provide benefits details and the rest of the role table later.
- `client/public/index.html` meta description still lists old roles; update it with the owner.
