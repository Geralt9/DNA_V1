# DNA — frontend

Showcase site for **DNA Screen Printing** (Kitchener, since 1994): a gothic/angelic frame around the brand's own printed work.
Vite + React (JavaScript), React Router, plain CSS with custom properties, GSAP for motion, Phosphor icons.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
```

```bash
npm run build      # production build → dist/
npm run preview    # serve dist/ locally
npm run images     # regenerate /public/images from ../usable_assets (only needed if source art changes)
```

Requires Node 18+. The generated images are committed, so `npm run images` is optional. It reads `../usable_assets` read-only and never writes there.

> npm 11 may warn that `sharp` and `esbuild` have install scripts "not yet covered by allowScripts". Both ship prebuilt binaries and work without them, so the warning is safe to ignore.

**Try the account flow (mock mode):** log in with `demo@dna.test` / `revolution94`, or create a new account. Accounts persist in `localStorage`. Signing up with `demo@dna.test` shows the "email already taken" server error.

## Folder structure

```
dna-frontend/
├─ index.html                 # pre-paint theme script (no flash of wrong theme)
├─ public/
│  ├─ images/                 # generated responsive WebP (art pairs, products, tree mask, logo)
│  └─ favicon.png
├─ scripts/build-images.mjs   # sharp pipeline: usable_assets → public/images + manifest
└─ src/
   ├─ main.jsx / App.jsx      # providers, routes, modal-over-gallery routing, route focus
   ├─ styles/
   │  ├─ variables.css        # palette, semantic light/dark tokens, type scale, motion tokens, @font-face
   │  ├─ base.css             # reset, typography, buttons, focus, view-transition + fallback rules
   │  └─ components.css       # shared section / "piece" / skeleton primitives
   ├─ assets/fonts/           # Night Sacred, Berosong, Monster Rocker (from usable_assets/Fonts)
   ├─ components/             # Header, MobileMenu, ThemeToggle, ThemedArt, Footer, ProductDetail, Field, Img, Logo, PageLoader
   ├─ pages/                  # Home, Designs, ProductModal, ProductPage, About, Account, NotFound
   ├─ context/                # ThemeContext, AuthContext
   ├─ hooks/                  # useProducts/useProduct, useForm (+ validation rules), useReveal (GSAP), useDocumentTitle
   ├─ services/               # config (USE_MOCKS), api (fetch wrapper), products/auth/user services
   ├─ mocks/                  # products, users, simulated latency
   └─ data/                   # site facts, imageManifest.json (generated)
```

## How the key pieces work

- **Theme**: `ThemeContext` reads `localStorage['dna-theme']`, falls back to `prefers-color-scheme`, and follows OS changes until the visitor picks a theme. Toggling uses `document.startViewTransition` to crossfade the whole page (art and colours together, 780ms, `cubic-bezier(.45,0,.2,1)`). Where that API is missing, `<ThemedArt>` stacks both images and fades opacity while `.theme-fading` transitions colours. With `prefers-reduced-motion` the switch is instant.
- **Footer tree**: `Side_page_art` is converted to a luminance → alpha mask, then drawn with CSS `mask-image` filled by `--tree-ink` (graphite on vellum, gilt on ink), plus a gradient mask so it has no edges. GSAP ScrollTrigger scrubs it upward as the footer enters.
- **Motion**: transform and opacity only. `useReveal` binds `data-reveal="up | lines | image"` elements. Everything is gated behind `gsap.matchMedia('(prefers-reduced-motion: no-preference)')`.
- **Product detail**: links from the gallery carry `state.backgroundLocation`, so `/designs/:id` opens as a native `<dialog>` over the gallery. A direct visit renders a full page.

## Connecting the backend

1. Copy `.env.example` → `.env` and set:
   ```
   VITE_API_URL=http://localhost:4000/api   # your Express server
   VITE_USE_MOCKS=false
   ```
2. `USE_MOCKS` (`src/services/config.js`) is the single switch. Every service checks it and otherwise calls `api` (`src/services/api.js`), which:
   - prefixes `VITE_API_URL`, sends/parses JSON, sets `credentials: 'include'` (for the `RefreshToken` cookie)
   - adds `Authorization: Bearer <accessToken>`
   - normalises every error to `ApiError { message, status, code, fieldErrors }`. It understands `{ error }`, `{ message }`, zod `{ errors|issues: [{ path, message }] }` and `{ fieldErrors }`. `fieldErrors` keys appear inline under the matching form field.
3. Field names already match `Server/validators/auth.schema.js`: `fullName`, `emailAddress`, `password` (8–72 chars).

### Every `TODO(backend)` location

| File | Line | What to connect |
|---|---|---|
| `src/services/config.js` | 7 | Set `VITE_API_URL` for the deployed API |
| `src/services/api.js` | 11 | Replace the sessionStorage token copy with refresh-on-boot once `/auth/refresh` exists |
| `src/services/api.js` | 116 | On 401/403 "Token Expired": call `POST /auth/refresh` once, store the new token, retry |
| `src/services/authService.js` | 28 | `POST /auth/signup` → `{ user, accessToken }` (+ RefreshToken cookie) |
| `src/services/authService.js` | 48 | `POST /auth/login` → `{ user, accessToken }` (+ RefreshToken cookie) |
| `src/services/authService.js` | 61 | `POST /auth/logout` → clear the RefreshToken cookie |
| `src/services/authService.js` | 81 | With no token in memory, try `POST /auth/refresh` before treating the visitor as logged out |
| `src/services/authService.js` | 83 | `GET /auth/me` → `{ user }` |
| `src/services/userService.js` | 19 | `GET /users/me` → `User` |
| `src/services/userService.js` | 38 | `PATCH /users/me { fullName }` → `User` |
| `src/services/productsService.js` | 30 | `GET /products?category=&garment=&featured=` → `Product[]` |
| `src/services/productsService.js` | 41 | `GET /products/:id` → `Product` (404 when missing) |
| `src/services/productsService.js` | 52 | `POST /products` (admin) |
| `src/services/productsService.js` | 64 | `PUT /products/:id` (admin) |
| `src/services/productsService.js` | 74 | `DELETE /products/:id` (admin) → 204 |
| `src/context/AuthContext.jsx` | 17 | Boot sequence becomes "refresh, then `/auth/me`" |
| `src/mocks/products.js` | 7 | The `Product` shape below is the contract the API should return |
| `src/components/Img.jsx` | 16 | If the API sends `imageUrl` / `detailImageUrl`, they're used instead of local manifest keys |

**Product shape**

```js
{
  id: 'maylene-wolf',            // slug, used in /designs/:id
  title: 'Wolf Headdress',
  client: 'Maylene and the Sons of Disaster',
  category: 'band' | 'event' | 'shop' | 'trade',
  garment: 'black' | 'navy' | 'light',
  year: 2012 | null,
  featured: true,                // first four featured pieces fill the home hero
  summary: '…', description: '…', alt: '…',
  image: 'p-maylene-wolf',       // or imageUrl: 'https://…'
  detailImage?: '…', detailAlt?: '…'
}
```

**User shape**: `{ id, fullName, emailAddress, createdAt }`

## Browser support

Evergreen browsers. View Transitions are used where available (Chromium, Safari 18+), with the CSS fallback elsewhere. Masks use standard and `-webkit-` properties.
