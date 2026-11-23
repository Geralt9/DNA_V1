# Decisions

Design and engineering choices, with the reasoning behind each. Source material lives in `../usable_assets` and was only read, never changed.

---

## 0. What was in usable_assets

### Page_art: theme images, paired light ↔ dark
I paired the images by **subject and composition**, not just by file name, so each crossfade reads as one scene turning from day to night:

| Where | Light | Dark | Why they pair |
|---|---|---|---|
| Home hero | `Light_theme1.jpg`, winged angel rising into a shaft of light | `Dark_theme2.jpg`, crowned skull with a halo in red robes | Same 736px portrait, same centred figure and halo. Ascension ↔ dominion |
| Home story | `Light_theme4.jpg`, skeleton wreathed in red roses on cream | `Dark_theme.png`, jewelled crowned skull in dark roses | Skull + red roses in both |
| About | `Light_theme2.jpg`, pencil drawing of a crowned winged rider on a griffin | `website_art2.jpg`, hooded reaper in blue mist | Lone mythic figure on a misty sky. `website_art2` has no Light/Dark prefix but is clearly night art, so it serves as the dark half |
| Account | `Sign_up_light_theme.jpg`, arched gate in the clouds | `Sign_up_dark_theme.jpg`, gothic nave and stained glass | Supplied as a pair. Both are arched thresholds |
| Designs header | `Light_theme.jpg`, silver relief of a hand on a sword hilt | *derived*: same image, darkened and desaturated | No dark counterpart was supplied |
| Home CTA | `Light_theme3.jpg`, vermilion woodcut of two angels | *derived*: same woodcut, negated + hue-rotated 180° so it prints **red on black** | No dark counterpart was supplied. The inversion keeps the line work red, which looks deliberate rather than filtered |

The two derived variants are real files made by `scripts/build-images.mjs`, so the crossfade blends two actual images everywhere.

### assets: the brand's own work
- The brand is **DNA Screen Printing**, 18 Charles St. W, Kitchener, founded 1994. The folder contained a previous build of their site (`index-*.js/css`); its copy and alt text were mined for **facts only**. Nothing about clients, dates, equipment or ink was invented.
- **9 printed tees**, each with a 1000×1339 photo and a thumbnail. The thumbnails are just smaller copies, except `img-0104-CVps` (a wide close-up of the A Rebel Few print), which became the "Print close-up" view in the detail modal.
  - Hello Amora: rabbit magician (black), balloon clown (light)
  - Heavy T.O. 2012: three reapers (black)
  - A Rebel Few: distressed gold (black)
  - Maylene and the Sons of Disaster: yellow serpent (black), wolf headdress (light)
  - Mom's Tattoo Shop: pin-up skull, vintage robot (black)
  - Colt Canada: True North Strong & Free back print (navy)
- **Logo** `dna-logo-dark`: a winged fist on a star. The wings suit the angelic direction, so it's the emblem. I cropped it above its own "DNA" lettering (rows 345+) so it sits beside a typeset wordmark without repeating it, and render it as a CSS mask so it takes the theme's text colour.
- **Not used**: `dna-logo-sm` (lime green, off palette), `header-image` / `home_header1` (old banners with an off-palette wood texture), `detour-charles-west` (an expired construction-detour map), and the two Rutland ink adverts (third-party ads, not DNA's work). Their one fact, phthalate-free inks, appears as copy instead.

### Fonts
**Revised after review: the gothic faces were too much for reading.** Roles now:
- **EB Garamond** (variable, self-hosted via `@fontsource-variable/eb-garamond`, no Google request): **everything people read**: body, navigation, buttons, labels, forms, product titles, chapter headings. It's a classic Garamond revival with a calm book texture that suits "cathedral" without shouting, and it isn't one of the generic AI-default fonts. Body uses old-style figures; headings use lining figures.
- **Night Sacred** (from usable_assets): kept **only for display moments**: page headlines (hero, Designs, About, Account, 404), the big Home section titles, the footer statement, the wordmark and the mobile-menu links. It has no figures or `& ? !`, which fall back to Garamond.
- **Berosong** (from usable_assets): kept **only where it's set large**: the hero's 01 / 04 counter, the big figures in the facts row (1994 · 5 · 8 · 0) and the About chapter numerals. At small sizes it was hard to read, so it's no longer used for any body text or labels.
- **Monster Rocker** (from usable_assets): the single faint "DNA" watermark behind Featured pieces.
- **Demonic Scrawl**: not used. Its metrics are very large and a second brush face would be noise.

### Inspiration
- **ColorPalette.png**: `#0B0B0B` (ink), `#D3A121` (gilt), `#FAF4E4` (vellum). See §2.
- **header_layout_style1.png** → what I took: a thin horizontal header with the mark at left, tracked small-caps nav beside it, a short tagline and utilities at right; the oversized stacked headline over a dominant figure; and the **"01 / 04" counter with square prev/next arrows**. What I left: the dark-photo collage, the bold grotesk type and the dense module grid.
- **Items_showcase.png** → the giant faded word behind products (our Monster Rocker "DNA"), and products presented as figures, not boxed cards. I left the coloured panels and chamfered corners.
- **Sign_Up_style.png** → the split layout: tall art panel with a two-line display caption on the left, a plain form on the right, a full-width primary button, and a "switch to log in" line. I left the Google/Apple buttons, since there's no OAuth to back them and fake affordances erode trust.
- **Side_page_art.jpg**: the DNA tree (helix trunk, branches above, roots below). Used in the footer (§5). It's also a nice pun on the brand name.

---

## 1. Stack
- **Vite + React (JS) + React Router 7**, plain CSS with custom properties. One token file (`src/styles/variables.css`) holds palette, semantic tokens, type scale, spacing and motion.
- **GSAP + ScrollTrigger** for scroll choreography (matchMedia gives reduced-motion gating for free). CSS handles simple state transitions.
- **Phosphor icons** at regular/light weight, which pair well with hairline gothic ornament. The theme toggle and menu icon are hand-drawn SVG/CSS.
- **sharp** (dev only) generates responsive WebP at 2–3 widths per image, the tree alpha mask, the cropped logo and the favicon. Source art totalled ~22MB (one 4.3MB PNG). Pages now load ~60–250KB images chosen by `srcset`.
- Non-Home routes are lazy-loaded. Phosphor tree-shakes (verified: no unused icons in the bundle).

## 2. Colour
Only the three palette colours. Every other token is a plain sRGB mix of them, and the percentages are commented in `variables.css`. Contrast was computed, not eyeballed:

| Token | Light | Dark | Contrast on `--bg` |
|---|---|---|---|
| `--text` | ink | vellum | 17.9:1 |
| `--muted` | ink 74% / vellum | vellum 68% / ink | 8.3 / 8.4:1 |
| `--accent-text` | gilt 50% / ink = `#6F5616` | gilt | 6.3:1 (5.1 on `--surface-2`) / 8.3:1 |
| `--border-strong` (inputs, 3:1 UI rule) | `#838078` | `#6B6862` | 3.6 / 3.5:1 |

- Pure gilt on vellum is only 2.15:1, so in light mode **gilt is decoration** (rules, lozenges, halos, focus glow) and **text uses `--accent-text`**.
- **Errors stay in-palette**: no red was added. An error is carried by an icon, text, a thicker 4px left border and an error summary, so it never depends on colour. Error text uses `--accent-text` / gilt (AA in both themes).
- Shadows use a warm ink-brown tint in light mode and pure black in dark.

## 3. Art direction
- **The arch is the system.** Lancet-arch frames (`border-radius: 999px 999px 0 0`) hold theme art and products. The hero puts a small arched product frame in front of a large arched art window, with a gilt **halo ring** behind the shirt. Theme art frames the garment, and the garment always sits on top.
- **Gilt tracery**: a 1px gilt line inset inside arches and photos, like a mount or stained-glass leading. Gilt corner brackets ("carved stone") on the story image. A lozenge-and-hairline `.rule` as the section ornament.
- **Roman numerals** number the featured pieces, the gallery, the menu and the About chapters, for cathedral-plaque formality with the brand's founding year set as MCMXCIV in the margin.
- **Negative space**: sections breathe with `--space-2xl`. Copy runs flush-left and the art sits off-axis.
- **No-AI-slop self-audit**: no decorative gradients (the only gradients are functional fade masks and the photo caption scrim), no centred hero, **no pill buttons** (rectangular buttons with a gilt frame that settles in on hover), no emoji, and no uniform card grid. The gallery staggers its middle column and Featured staggers four heights. No glassmorphism cards, no stock icons in circles, no "Trusted by" row.

## 4. Theme switching
- **Default** = `prefers-color-scheme`. An explicit choice is saved to `localStorage['dna-theme']`. Until the visitor chooses, the site follows OS changes live.
- A pre-paint script in `index.html` sets `data-theme` before CSS loads, so the wrong theme never flashes.
- **Crossfade**: the View Transitions API snapshots the page and crossfades old → new in **780ms, `cubic-bezier(.45,0,.2,1)`**, which is slow and symmetrical, like a cathedral window clouding over. Art and colours move as one. During the transition `.theme-vt` disables CSS transitions so nothing animates twice. **Fallback**: `<ThemedArt>` keeps both images stacked and fades opacity while `.theme-fading` transitions colours for one cycle (verified at mid-transition: 24% / 76%). **Reduced motion**: instant.
- The toggle icon is a sun whose rays retract while a shadow disc slides across into a crescent (transform and opacity only).

## 5. Footer tree
- The JPG was converted to **luminance → alpha** (white paper → transparent, ink → opaque) and drawn with `mask-image` over `background: var(--tree-ink)`. That gives graphite lines on vellum and **gilt lines on ink**, with no paper rectangle and no blend-mode artefacts.
- A second gradient mask, composited with `intersect`, fades the crown and dissolves the roots, so the tree has **no edges**. It grows *from* the footer.
- On scroll, ScrollTrigger scrubs the tree up from 38% below with rising opacity, slower than the page (parallax). A twin-ring gilt **halo** opens behind the crown, and the footer statement drifts up at a different rate.
- Desktop: the trunk stands in a dedicated centre column, with text left and right. Tablet/phone: the tree stands above and the content gathers below its roots.

## 6. Pages
- **Home**: hero (arch art + product carousel with keyboard ← →, `aria-roledescription="carousel"`, live caption) → Featured pieces (4 non-hero pieces; a horizontal snap rail on phones) → brand story (real 1994 origin, four facts) → CTA ("Bring us your art", using the real art-spec guidance: 300 dpi, Pantone, proofs).
- **Designs**: filters are native radio groups (arrow keys work) styled as text tabs with a gilt underline, and they live in the URL (`?category=band&garment=light`), so filtered views are shareable. Category counts, a live result count, an empty state with reset, and stale-while-loading (old results dim instead of flashing to skeletons).
- **Product detail**: a native `<dialog>` (free focus trap, Esc, inert page) over the gallery with open/close choreography. Prev/next replace history so Back closes the modal. Direct links render a full page. A bad slug gives an honest 404 message.
- **About**: five chapters (I–V) from the brand's real history, next to a sticky arched art panel.
- **Account**: tabs (ARIA tablist with arrow/Home/End) for Create account / Log in; signed-in state shows a profile with an editable name, save status and log out.
- **Copy**: plain, active, specific; no lorem ipsum, no invented testimonials or statistics.

## 7. Forms
- Validation **mirrors the server's zod schema** (`fullName` 2–100, `emailAddress` valid, `password` 8–72), so client and server agree.
- Fields validate on **blur**, then live once they've shown an error, so nobody gets an error mid-first-keystroke. Submit validates everything and focuses an **error summary** whose items link to their fields.
- Each error shows an icon, its text and a thick border, and is wired with `aria-invalid` + `aria-describedby`. The password field has a show/hide toggle (`aria-pressed`). Inputs are ≥16px to avoid iOS zoom, with correct `autocomplete` tokens.
- **Loading**: the fieldset is disabled, the button shows a spinner and says what's happening ("Creating your account…"), and double submits are ignored.
- **Server errors**: `ApiError.fieldErrors` map to inline field errors (e.g. "That email already has an account. Log in instead?"). Other errors appear in the summary.
- Social login buttons were left out on purpose (see Inspiration).

## 8. Accessibility & quality
- Skip link; landmarks (header/nav/main/footer); one `h1` per view; `aria-current` via NavLink; visible `:focus-visible` rings (ink in light, gilt in dark); 44px minimum targets.
- Route changes scroll to top, move focus to `<main>`, update `document.title`, and refresh ScrollTrigger. Opening or closing the modal does neither (it tracks the page underneath).
- Mobile menu: page behind is `inert` and scroll-locked, focus moves in, Tab loops, Esc closes, and focus returns to the button.
- Themed art: only the visible image is exposed to screen readers, and each has its own alt. Decorative ornaments are `aria-hidden`.
- Images: `srcset` + `sizes` for hi-DPI, explicit `width`/`height`, lazy below the fold, `fetchpriority=high` on the hero.
- Motion: transform and opacity only (the gallery and hero use `transform`, menus and modal use opacity/transform keyframes). `prefers-reduced-motion` disables GSAP entrances and the theme crossfade, and shortens CSS motion to near zero. Entrance-hidden states only apply when JS has confirmed motion is allowed (`html.js-motion`), so content is never stuck invisible.

## 9. Verification performed
- `npm run build` passes.
- Headless Chrome screenshots of every page in **both themes** at **360, 375, 768, 1440 and 1920px**. **No horizontal overflow** at 360/375.
- **Console clean** across 56 runs (7 routes × 2 themes × 2 widths, scrolled top to bottom).
- Scripted interaction checks, all passing: View Transition crossfade (captured mid-fade), the non-VT fallback, reduced motion (0 hidden elements, instant switch), theme persistence across reload, hero carousel, gallery filters + URL sync + arrow keys, modal open/focus/prev-next/Esc with scroll position preserved, sign-up validation → loading → "email taken" server error, wrong-password login error, demo login → profile → save → log out, mobile menu focus trap + Esc, product 404.

## 10. Notes on the brief
- The brief named a set of installed skills (emil-design-eng, tastemaker, no-ai-design-slop and others). **They are not installed in this environment**, so they couldn't be loaded. I applied their stated intent directly (the no-slop audit in §3, accessibility in §8, motion rules in §4/§8).
- Night Sacred and Monster Rocker (the two shipped faces besides Berosong) are **DEMO** font files. Check their licences before production; the demo versions are usually personal-use only.
- The site is a showcase, not a shop: no prices or cart, because no pricing data exists and DNA sells print runs, not stock garments. The detail page's call to action leads to an account and a phone number instead.
