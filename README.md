# Last5 Deal — Next.js + Ant Design

A Next.js 14 (App Router) clone of the supplied `Last5_Deal_Full_Website` HTML project. The public website and the customer account are both included, keeping the original layout, typography, colours and interactions.

## Run

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
npm start
```

A sample sign-in is available from the header. The demo account uses browser `localStorage` under `last5.website.customer.v2`, exactly like the original build.

## Where everything lives

| Path | Purpose |
| --- | --- |
| `src/css/` | **All styling lives here** — the files you can edit freely |
| `src/css/brand.css` | Roboto `@font-face`, brand palette and logo sizing |
| `src/css/website.css` | Public website (original `dist/styles.css`) |
| `src/css/account-base.css` | Account dashboard base styles |
| `src/css/account.css` | Account dashboard components |
| `src/css/app.css` | Global shell + Ant Design alignment |
| `src/css/typography.css` | Final readable type scale, form sizing, hero sticker sizing |
| `src/app/(public)/` | Public routes (home, explore, food, shops, bag, checkout, journal, help, auth, policies) |
| `src/app/account/` | Customer account routes (`/account/overview`, `/account/orders`, …) |
| `src/components/` | Shared React components, public chrome, account shell |
| `src/components/account/AccountModals.jsx` | All account dialogs/drawers (cart, order, pass, support, …) |
| `src/lib/model.js` | Shops, foods, orders, cart and checkout rules |
| `src/lib/data.js` | FAQs, journal stories, categories |
| `src/lib/icons.js` | The original vector icon set as a React component |
| `public/assets/` | Supplied brand logo, favicon and mark, photos, QR sample and bundled Roboto fonts |

## Brand palette

The project uses the supplied reference palette throughout:

| Role | Value | Used for |
| --- | --- | --- |
| Primary | `#19678B` | Headings, navigation, primary buttons, brand surfaces |
| Secondary | `#1FA5CD` | Highlights, active borders, logo badge |
| Accent | `#7DC142` | Offer badges, savings sticker, logo leaf |

Assets: `last5-logo.svg`, `favicon.svg`, `last5-mark.svg` and `brand-reference.svg` in `public/assets/`.

## Readability

The imported design used many 8–11px labels. All text now has a **12px minimum**, body copy is **15.5px**, inputs are **15px**, and long-form copy uses a comfortable line height. The final layer is `src/css/typography.css` — adjust the base sizes there to tune the project.

## CSS scoping (important)

The original project shipped two independent CSS files with the same class names. To keep both apps pixel-identical without collisions, the styles are scoped to a wrapper:

- public pages use `<div class="public-app">` and `src/css/website.css` selectors start with `.public-app`
- account pages use `<div class="account-app">` and account selectors start with `.account-app`

When you edit a rule, keep the wrapper prefix. For example:

```css
/* src/css/website.css */
.public-app .hero h1 { font-size: 48px; }

/* src/css/account.css */
.account-app .page-heading h1 { font-size: 28px; }
```

Brand tokens (`--brand-primary`, `--brand-secondary`, `--brand-accent`) are global in `brand.css`; each app also has its local palette in its own root selector. If you need to re-import the untouched originals, copy them from `../Last5_Deal_HTML_Source/dist` into `src/css/` and run `node scripts/scope-css.js && node scripts/fix-assets.js`.

## Ant Design usage

`antd` is configured through `src/components/AntdTheme.jsx` (`ConfigProvider` + brand tokens). The design is intentionally preserved, so Ant Design supplies behaviour rather than overwriting the original look:

- `Modal` / `Drawer` power every dialog and side panel (mask, focus trap, Escape/backdrop closing)
- `Table` renders the account payments and refunds ledger
- `Switch` powers account preference toggles
- `ConfigProvider` applies the Last5 palette, Roboto and radii to all Ant Design internals

## Notes

- All data is fictional and stored locally; no real payment, authentication or submission happens.
- The public site and the account share one store, so adding food, favourites and orders stays in sync.
- `npm run build` completes with all routes prerendered.
