# The Daily Pour: Style guide

The Daily Pour is a cosy neighbourhood coffee shop in Brooklyn: specialty coffee, fresh pastries and light lunches, with open mic on Friday evenings and coffee tastings on Saturday mornings. People come to the site to check the menu, see what's on and reserve a table. The site should feel like the counter. It's warm, a bit loud and good-humoured, and it never gets in the way of booking a table.

This guide covers **why** things look the way they do. Exact values are in [tokens.css](tokens.css), and building blocks are in [components.md](components.md).

---

## 1. Design principles

1. **One loud thing per screen.** Each screen gets one showpiece: the pour ribbon, the hero headline or the order sticker, never all three at the same volume. Everything around it stays calm: milk background, espresso text, generous space.
2. **Type is the illustration.** The chunky display face carries the personality, and headlines are set big enough to be part of the composition. Photography of real drinks and beans is the only other imagery.
3. **Things are slightly askew.** Tags, ribbons and stickers sit at small rotations (between −12° and +12°, with ribbons at about −4°). Text blocks, forms and prices never rotate. Tilt is for the playful layer, and the information layer stays straight.
4. **Green is the shop, crema is the light.** Roastery green marks brand surfaces (ribbon, footer and frame). Crema yellow only ever appears *on* green or espresso, like crema on a shot. It is never used as a text colour on milk.
5. **A table is always one step away.** On every screen, "Reserve a table" is visible and named plainly.

### What we took from the references

| Reference | Kept | Left behind |
|---|---|---|
| *The Daily Pour 3* (green ribbons, pill cloud) | Tilted marquee ribbons with bean glyphs, scattered pill tags, green and crema pairing, beans falling into a green footer | Script word scribbled over the heading, all-caps condensed labels |
| *coffee-hero-design* (Coffeelo) | Chunky soft display type at hero scale, product photo overlapping the headline, wavy "Order now" sticker, coloured frame around a rounded page | Rust-red as a dominant colour (we keep it for the sticker only) |
| *coffee-design* (Onea) | Circular product plates with name and price, vertical category rail with round icons, pill search field | Poppins (too generic), illustrated drinks, exclamation-mark headlines |

---

## 2. Colour

### Palette

| Token | Hex | Name | Role |
|---|---|---|---|
| `espresso` | `#3E1A0D` | Espresso | Display type, body text, primary buttons |
| `milk` | `#FAF3E6` | Steamed milk | Page background |
| `foam` | `#FFFBF4` | Foam | Raised surfaces: fields, menus, toasts |
| `roastery` | `#143D2C` | Roastery green | Brand surfaces: ribbon, footer, page frame |
| `crema` | `#F4B81C` | Crema | Highlights *on green or espresso*: ribbon glyphs, footer headings, selected state |
| `roast` | `#B0360F` | Roast red | The order sticker. Destructive actions. Nothing else. |

Supporting tones: `latte` `#D9C2A0` (decorative hairlines), `latte-deep` `#A88660` (form borders), `cocoa` `#6E4A38` (secondary text), `roastery-ink` `#1E5A41` (links on milk), `crema-soft` `#FBE3A0` (selected chip fill).

### Proportions

Roughly **70 milk · 15 espresso · 10 green · 4 crema · 1 roast**. If a screen looks busy, there's usually too much green or crema on it.

### Approved pairings (WCAG 2.2)

| Foreground on background | Ratio | Use |
|---|---|---|
| Espresso on milk | 14.0 : 1 | All text |
| Cocoa on milk | 7.1 : 1 | Secondary text, meta |
| Roastery-ink on milk | 7.3 : 1 | Links |
| Milk on roastery | 11.0 : 1 | Text on brand surfaces |
| Crema on roastery | 6.8 : 1 | Ribbon text, footer headings |
| Espresso on crema | 8.6 : 1 | Text on crema chips or buttons |
| Foam on roast | 6.0 : 1 | Sticker text, destructive buttons |
| Latte-deep on milk | 3.1 : 1 | Form borders (non-text, meets 3:1) |
| Steam on night | 15.6 : 1 | Late-shift body text |

**Never use:** crema text on milk, latte for text or for anything that has to be seen to be used (it's 1.6:1), or roast for anything other than the sticker and destructive actions.

### Semantic tokens

Components should use semantic tokens (`bg-page`, `text-ink`, `border-line`, `bg-brand`, `text-highlight` …), not raw palette names. This keeps the **Late shift** dark theme working without per-component overrides. The full map is in [tokens.css §6](tokens.css).

### Late shift (dark theme)

The dark theme follows `prefers-color-scheme`, and can be forced with `data-theme="dark"` / `"light"` on `<html>`. It is a roasted-brown theme, not black: the page is `night` `#1C0F09`, text is `steam` `#F5E9D6`, and crema takes over as the link and focus colour. Product photography stays the same.

---

## 3. Typography

### Families

| Role | Family | Loaded as | Why |
|---|---|---|---|
| Display | **Bagel Fat One** (400 only) | `--font-bagel` → `font-display` | Soft, swollen letterforms that look poured rather than printed. It matches the chunky hero in the Coffeelo reference and holds up at 150px. |
| Text and UI | **Gabarito** (variable 400–900) | `--font-gabarito` → `font-sans` | A rounded geometric sans with a friendly lowercase `a` and `g`. It's distinct enough from Bagel not to compete, and warmer than the Poppins in the Onea reference. |

There are only two families and no monospace face. Prices use Gabarito with `tabular-nums`.

**Setup** (replaces the Geist fonts in `app/layout.tsx`):

```tsx
import { Bagel_Fat_One, Gabarito } from "next/font/google";

const bagel = Bagel_Fat_One({
  variable: "--font-bagel",
  weight: "400",
  subsets: ["latin"],
});

const gabarito = Gabarito({
  variable: "--font-gabarito",
  subsets: ["latin"],
});

// <html className={`${bagel.variable} ${gabarito.variable} h-full antialiased`}>
```

### Scale

The scale is Bringhurst's classic progression (12 · 14 · 16 · 18 · 21 · 24 · 36 · 48 · 60 · 72), plus one fluid hero size.

| Utility | Size / leading | Family / weight | Use |
|---|---|---|---|
| `text-hero` | 48→152px / 0.88 | Display | Hero headline only, once per page |
| `text-pour-xl` | 72 / 0.92 | Display | Large section openers on desktop |
| `text-pour` | 60 / 0.95 | Display | "Order now" footer band |
| `text-feature` | 48 / 1.0 | Display | Feature headings, mobile section openers |
| `text-section` | 36 / 1.05 | Display | Section headings |
| `text-heading` | 24 / 1.25 | Sans 700 | Sub-headings, drawer titles |
| `text-title` | 21 / 1.3 | Sans 700 | Drink names, card titles |
| `text-lede` | 18 / 1.6 | Sans 400 | Intros and drink descriptions |
| `text-body` | 16 / 1.6 | Sans 400–500 | UI and body copy |
| `text-small` | 14 / 1.5 | Sans 500 | Meta, helper text, list prices |
| `text-fine` | 12 / 1.5 | Sans 500 | Allergen notes and legal text only |

### Rules

- **Display face is for 36px and up.** Below that it clogs. The one exception is pill tags and ribbon text (16–24px), where its chunkiness is the point.
- **Sentence case everywhere** ("Order now", "Today's pour", "Oat milk +60p"). Bagel already shouts, so it doesn't need capitals to help. No tracked-out all-caps labels.
- **Headlines get no accent tricks.** Don't italicise, recolour or scribble over one word. If a headline needs emphasis, make it bigger.
- **Tight display leading.** Stacked hero lines may touch descenders to ascenders. That density is part of the look.
- **Measure:** body text maxes out at `max-w-[62ch]`, and lede at `max-w-[52ch]`.
- **Weights in Gabarito:** 400 for body text, 500 for UI and meta, 700 for titles and buttons, and 800 only for prices in the basket total. Don't use 900.

---

## 4. Layout

### The frame

Every page sits inside a **frame**: a rounded (`rounded-frame`) milk panel inset from a roastery-green gutter. This idea comes from the Coffeelo and Onea references. The gutter is 12px on mobile, 20px on tablet and 28px on desktop. On mobile the frame keeps its top corners and loses its bottom corners at the footer join.

```
┌──────────────────────────────── green gutter ───────────────────────────────┐
│ ╭─────────────────────────────────────────────────────────────────────────╮ │
│ │  The Daily Pour          Menu   Today's pour   Find us        (Order)   │ │
│ │                                                                         │ │
│ │   Your usual,                       [ cup photo overlaps type ]         │ │
│ │   poured                                                                │ │
│ │   properly.                              ⬢ Order now (sticker)          │ │
│ │                                                                         │ │
│ │   Single-origin espresso,                                               │ │
│ │   roasted on Tuesdays.                                                  │ │
│ │╱╱╱╱╱ Doppio ✱ Flat white ✱ Cortado ✱ Oat latte ✱ Mocha ╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱│ │ ← pour ribbon
│ │                                                                         │ │
╰─┴─────────────────────────────────────────────────────────────────────────┴─╯
```

### Grid

- **Container:** `max-w-[78rem]` (1248px) inside the frame, `px-5 md:px-10 lg:px-16`.
- **Columns:** 4 on mobile, 8 from `md`, 12 from `lg`, with a `gap-x-6` (24px) gutter.
- **Vertical rhythm:** spacing comes from Tailwind's default 4px `--spacing` scale. Use `py-16` (mobile) and `py-24` / `py-32` (desktop) between sections. Within a section, use `gap-4` for related items and `gap-10` between groups.

### Alignment

- **Left-aligned by default.** Headlines, body text and forms are all ranged left.
- **Centre** is reserved for the category-tag cloud and the "Order now" footer band, where content is a cluster rather than a reading line.
- **Overlap is deliberate.** Product photography may overlap the hero headline, sitting over the display type and under the sticker. Text never overlaps text.

### Breakpoints

Use Tailwind defaults: `sm` 640 · `md` 768 · `lg` 1024 · `xl` 1280. Design mobile-first at 360px wide with a 16px minimum side gutter and no horizontal scroll. The ribbon handles its own overflow with `overflow-hidden` on its wrapper.

---

## 5. Imagery

- **Photography:** real drinks, food, beans and café life, sourced from **Pexels** and listed in one place (`lib/images.ts`), served from `images.pexels.com` through `next/image` with `fill` + `sizes`. Pexels photos aren't cut-outs, so they always sit **inside a shape**: a circular plate for food and drink (`rounded-full`, see DrinkCard), or a `rounded-panel` frame for scenes (events, the About page). Photos are never used as section or page backgrounds. Plates get `drop-shadow-cup`, never a box shadow. Pick warm, naturally lit shots and avoid any with visible third-party branding. Every photo needs real alt text describing what's in it.
- **Bean scatter:** loose beans at varied scale and blur (with closer beans blurred more) to add depth around the hero and above the footer. It's always decorative, so give it `alt=""` and `aria-hidden`.
- **Product plates:** list and card images sit on a solid circle of `crema`, `roast` at 85%, `roastery` or `latte`, rotated through in order. The drink may break out of the top of the circle.
- **Icons:** a single bean glyph is the only brand icon (used in ribbons and tags). UI icons are 1.75px-stroke, round-cap line icons at 20px. Lucide fits if a library is added.
- **No** illustrated drinks, stock flat-lays, latte-art close-ups as backgrounds, or gradient washes.

---

## 6. Motion

There is **one ambient motion: the pour ribbon** scrolls slowly (38s per loop, with the second band at 46s in reverse). Nothing else moves on its own.

| Moment | Motion | Token |
|---|---|---|
| Ribbon | Continuous horizontal marquee, paused on hover and focus-within | `animate-ribbon` |
| Add to order | Basket count bumps (scale 1→1.15→1, 240ms); toast settles in | `ease-pour`, `animate-settle` |
| Tag select | Tag straightens to 0° and fills `crema-soft` (180ms) | `ease-pour` |
| Drawer / menu open | Slides from the right, 320ms | `ease-swirl` |
| Page load | None. The hero is already there. | |

`prefers-reduced-motion: reduce` stops the ribbon (it renders as a static band) and collapses all transitions. The marquee also gets a visible pause control (see [components.md › PourRibbon](components.md#pourribbon)).

---

## 7. Voice and copy

We write like a good barista talks: short, warm and specific, and never cute at the customer's expense.

| Do | Don't |
|---|---|
| "Reserve a table" → "Table reserved for 4, Saturday at 10am" | "Submit" / "Success!" |
| "Oat milk at no extra charge" | "Plant-based dairy alternative available" |
| "Pick a time between 7am and 3pm." | "Invalid time" |
| "For more than 8, call the shop." | "Maximum party size exceeded" |
| "Sign-up sheet at the counter from 6:30pm" | "Registration is required for participation" |
| "Closed until 7am. You can still book for tomorrow." | "We're sorry, we are currently closed." |

- Use sentence case for everything, including buttons and headings.
- Button labels say exactly what happens, and the same verb follows through the whole flow ("Reserve a table" → "Reserving…" → "Table reserved").
- Prices are in US dollars ($3.50). Copy keeps the shop's British-leaning spelling ("neighbourhood", "colour").
- Don't add arrows or emoji to buttons and links.
- Errors explain what happened and what to do next. They don't apologise.
- Drink names are proper nouns: Flat white, Cortado, Oat latte.

---

## 8. Accessibility floor

- Text contrast is AA minimum (every approved pairing above is AA, and most are AAA).
- **Focus:** a 3px `focus` ring at a 3px offset, which is green on light and crema on Late shift. It's set globally in tokens.css, so don't remove it per component.
- **Targets:** at least 44 × 44px, including tags and stepper buttons.
- **Rotation is decorative.** Rotated elements must still read correctly to assistive tech, and focus rings rotate with them. Never rotate a form control.
- The ribbon is `aria-hidden` duplicated content, and the real category list is in the page as normal links.
- Prices include their currency in text, and allergen info is never conveyed by colour alone.
