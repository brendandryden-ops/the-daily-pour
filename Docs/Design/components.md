# The Daily Pour: Component specs

These specs are written for **Next.js 16 App Router + React 19 + Tailwind v4 + TypeScript**. Every class referenced here comes from [tokens.css](tokens.css). Read [style-guide.md](style-guide.md) first for the reasoning.

## Conventions

- **Location:** `components/ui/` for primitives and `components/` for composed sections. Use one component per file, named in PascalCase.
- **Server first.** Components are Server Components unless marked **client**. Only add `"use client"` where a spec says the component holds state or handles events.
- **Semantic tokens only** inside components (`bg-page`, `text-ink`, `border-line-strong`, `bg-brand`, `text-highlight`, `bg-hot`). Raw palette names (`bg-crema`, `text-espresso`) are for fixed-colour contexts that don't change in Late shift, such as text on a crema chip.
- **Class merging:** components accept `className` and append it last. If conflicting overrides become common, add `tailwind-merge`. Until then, keep it simple and concatenate.
- **Rotation** uses the `rotate-[…]` utilities and is always on a wrapper, never on a form control.

### Index

| Primitive | Composed |
|---|---|
| [Button](#button) | [PageFrame](#pageframe) |
| [ReserveSticker](#reservesticker) | [SiteHeader](#siteheader) |
| [DrinkTag](#drinktag) | [Hero](#hero) |
| [Price](#price) | [PourRibbon](#pourribbon) |
| [TextField and SearchField](#textfield-and-searchfield) | [TagCloud](#tagcloud) |
| [QuantityStepper](#quantitystepper) | [DrinkCard](#drinkcard) |
| [Toast](#toast) | [CategoryRail](#categoryrail) |
| [BeanGlyph](#beanglyph) | [EventCard](#eventcard) |
| | [ReserveDialog](#reservedialog) |
| | [SiteFooter](#sitefooter) |
| | [Empty and error states](#empty-and-error-states) |

> **Reservations, not orders.** The site takes table reservations instead of orders. Every "Order" call to action in these specs is "Reserve a table", and it opens the [ReserveDialog](#reservedialog). There's no basket, no `/order` route and no sticky order bar. QuantityStepper and Toast are kept for later use.

---

## Primitives

### Button

`components/ui/Button.tsx` is a pill-shaped action. It renders `<button>` by default, or a Next `<Link>` when given `href`.

| Prop | Type | Default |
|---|---|---|
| `variant` | `"primary" \| "secondary" \| "on-brand" \| "destructive"` | `"primary"` |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` |
| `href` | `string` | renders a `<Link>` when present |
| `icon` | `ReactNode` | trailing, 20px |

| Variant | Rest | Hover | Pressed | Use |
|---|---|---|---|---|
| primary | `bg-inverse text-ink-inverse` | `bg-[color-mix(in_oklab,var(--surface-inverse),black_18%)]` | `translate-y-px` | The single main action in a view ("Add to order", "Place order") |
| secondary | `border-2 border-ink text-ink bg-transparent` | `bg-highlight-soft` | `translate-y-px` | Alternatives ("See the full menu") |
| on-brand | `bg-highlight text-espresso` | `bg-[#ffc93a]` | `translate-y-px` | Actions on green surfaces (footer, ribbon area) |
| destructive | `bg-hot text-foam` | 10% darker | `translate-y-px` | "Remove from order", "Cancel order" |

| Size | Height | Padding | Text |
|---|---|---|---|
| sm | `h-10` (40px, with the hit area padded to 44 via `before:` inset) | `px-4` | `text-small font-bold` |
| md | `h-12` | `px-6` | `text-body font-bold` |
| lg | `h-14` | `px-8` | `text-title font-bold` |

- **Shape:** `rounded-full`, with no shadow.
- **Disabled:** `opacity-45 cursor-not-allowed`, no hover change, plus `aria-disabled`. Keep the label visible. If disabled needs explaining ("Choose a size first"), say it in helper text next to the button.
- **Loading:** keep the width and swap the label to the in-progress verb ("Placing order…"), with `aria-busy="true"`. Don't use spinners inside pills.
- **Transitions:** `transition-[background-color,transform] duration-150 ease-pour`.
- **Rule:** use one primary per view. A row of three primaries means the hierarchy is wrong.

```tsx
<Button href="/menu">See the full menu</Button>
<Button variant="on-brand" size="lg">Order now</Button>
```

---

### ReserveSticker

`components/ui/ReserveSticker.tsx` (**client**) is the wavy, scalloped badge from the Coffeelo reference. It's the only place `roast` appears as a fill, and the page's loudest call to action. Use **at most one per page.**

- **Shape:** a 12-lobe scalloped circle drawn as an inline SVG `<path>` behind the label (not `clip-path`, so the focus ring isn't clipped). Size is `size-32` on mobile and `size-40` from `md`.
- **Fill:** `fill-hot`. Label: `font-display text-heading md:text-section text-foam leading-[0.9]`, set on two lines ("Reserve / a table").
- **Rotation:** `-rotate-[10deg]` at rest. On hover, it turns to `-rotate-[4deg]` and scales to 1.04 over 220ms `ease-pour`. With reduced motion, it doesn't rotate.
- **Element:** a `<button aria-haspopup="dialog">` that opens the [ReserveDialog](#reservedialog). Its accessible name is the label text. The SVG gets `aria-hidden`.
- **Placement:** it overlaps the bottom-left edge of the hero product photo. Never place it over body text.

```tsx
<ReserveSticker className="absolute -bottom-4 -left-2 md:bottom-2 md:-left-10" />
```

---

### DrinkTag

`components/ui/DrinkTag.tsx` is a pill tag holding a drink or category name in the display face (from *The Daily Pour 3*). It has two modes:

| Mode | Element | Rest | Selected / current |
|---|---|---|---|
| `link` | `<Link>` | `border-2 border-line text-ink bg-raised` | n/a |
| `filter` | `<button aria-pressed>` (**client**, controlled by parent) | same | `bg-highlight-soft border-highlight` and rotation animates to 0° |

- **Type:** `font-display text-body md:text-lede`, sentence case ("Flat white").
- **Size:** `min-h-11 px-5`, `rounded-full`. Vertical tags (rotated ±70–90°) are allowed only inside [TagCloud](#tagcloud).
- **Bean variant:** a circular `size-11` tag holding only a [BeanGlyph](#beanglyph). It's decorative, so it's rendered as a `<span aria-hidden>`, not a control.
- **Hover:** `border-highlight`. No lift or shadow.
- **Rotation:** set with the `tilt` prop (degrees, from −12 to 12, or ±80 inside a cloud), applied via inline `style={{ rotate: … }}` so values come from data.

---

### Price

`components/ui/Price.tsx` formats money in one place.

- It uses `Intl.NumberFormat("en-US", { style: "currency", currency: "USD" })`, because the shop is in Brooklyn. Pass amounts in cents (integers), which is the `price_cents` column in `Docs/menu-items.csv`.
- **Classes:** `font-sans font-bold tabular-nums`. In lists use `text-small text-ink-muted`, on cards `text-body text-hot`, and for any total `text-heading font-extrabold`.
- **Modifiers** (`+60¢`) render with an explicit plus sign and `text-ink-muted`.
- **Never** write prices in the display face.

---

### TextField and SearchField

`components/ui/TextField.tsx` and `SearchField.tsx`.

| Part | Classes |
|---|---|
| Label | `text-small font-medium text-ink`, always visible above the field. Placeholders never stand in for labels. |
| Field | `h-12 w-full rounded-field border-2 border-line-strong bg-raised px-4 text-body text-ink placeholder:text-ink-muted/70` |
| Focus | global ring + `border-ink` |
| Helper | `text-small text-ink-muted mt-1.5` |
| Error | field `border-hot`; message `text-small text-hot` with a 16px alert icon, linked via `aria-describedby`, `aria-invalid="true"` |

- **SearchField** uses `rounded-full`, has a leading 20px search icon (`pl-11`) and `type="search"`, and sits inside a `<search>` element. The label is visually hidden ("Search the menu") because the icon and placeholder carry it visually.
- **Error copy:** "Enter a pickup time after 7am", not "Invalid time".

---

### QuantityStepper

`components/ui/QuantityStepper.tsx` (**client**).

- **Layout:** `inline-flex items-center rounded-full border-2 border-line-strong bg-raised h-12`.
- **Buttons:** `size-11` round, with `−` and `+` icons. Accessible names are "Remove one Flat white" and "Add one Flat white".
- **Value:** `min-w-8 text-center font-bold tabular-nums`, inside `<output aria-live="polite">`.
- **At the minimum (1),** the minus button becomes a remove (bin icon, "Remove Flat white from order"). It doesn't disable.
- **Max:** 12, after which the plus button is disabled and helper text reads "For bigger orders, call the shop."

---

### Toast

`components/ui/Toast.tsx` (**client**) confirms actions, using the same verb as the button.

- **Container:** fixed `bottom-4 inset-x-4 md:left-auto md:right-6 md:w-96`, with `rounded-panel bg-inverse text-ink-inverse shadow-lift p-4`.
- **Content:** a bean glyph in `text-highlight` + message (`text-body font-medium`) + optional action link (`text-highlight underline underline-offset-4`).
- **Motion:** `animate-settle`. It dismisses after 5s (paused while hovered or focused), and can be dismissed with Esc.
- **Region:** `role="status"` for confirmations and `role="alert"` for failures.
- **Copy:** "Added to order: Oat latte", with the action "View order".

---

### BeanGlyph

`components/ui/BeanGlyph.tsx` is the one brand icon: a coffee bean in a single-path SVG with `fill="currentColor"`, sized with `size-*`. It's decorative by default (`aria-hidden`). It's used in ribbons, bean tags and toasts. Don't redraw it per use.

---

## Composed

### PageFrame

`components/PageFrame.tsx` holds every route's content. It's applied once in `app/layout.tsx`.

```tsx
<body className="min-h-full p-3 md:p-5 lg:p-7">
  <PageFrame>{children}</PageFrame>
</body>
```

- **Frame:** `bg-page rounded-frame overflow-clip min-h-[calc(100dvh-1.5rem)]` (adjusting the subtraction to match the gutter at each breakpoint). The gutter colour comes from `body` (`--frame-gutter`).
- **Inner container:** `mx-auto max-w-[78rem] px-5 md:px-10 lg:px-16`, provided by the `Container` export of the same file. Each section wraps itself in `Container`, so sections that bleed full width (the ribbon and footer) simply don't.
- **Mobile:** the bottom corners are square (`max-md:rounded-b-none`) so the footer joins the edge.

---

### SiteHeader

`components/SiteHeader.tsx`, from the Coffeelo and Onea references.

```
The Daily Pour            Menu   About us   Events        [ Reserve a table ]
```

- **Wordmark:** "The Daily Pour" in `font-display text-heading text-ink`, linked to `/`. No logo mark is needed. The wordmark is the logo.
- **Nav:** `text-body font-medium text-ink` links with `gap-8`: Menu (`/menu`), About us (`/about`) and Events (`/#events`). The current page gets `aria-current="page"` and a 3px `crema` underline (`decoration-highlight underline underline-offset-8 decoration-[3px]`). `NavLinks` is a small **client** component so it can read the path.
- **Reserve button:** a primary `sm` Button, "Reserve a table", that opens the ReserveDialog.
- **Height** is `h-20`. Nothing on the site is sticky.
- **Mobile (< md):** wordmark and a "Menu" text button that opens a full-height drawer (`rounded-l-panel bg-raised`, slides in with `ease-swirl`), holding the nav links and a full-width "Reserve a table" button.

---

### Hero

`components/Hero.tsx`. The display headline is the image.

```
lg (12 col)
┌─────────────────────────────────────────────────────────────┐
│ Your usual,                          ┌──────────┐            │  cols 1–8: headline (text-hero)
│ poured                               │  cup     │            │  cols 7–12: product photo, overlaps
│ properly.                            │  photo   │            │      the headline's right edge
│                                      └──────────┘            │
│ Single-origin espresso,     ⬢ sticker                       │  cols 1–4: lede + secondary button
│ roasted on Tuesdays.                                         │
│ [See the full menu]                    · beans scattered ·   │
└─────────────────────────────────────────────────────────────┘
mobile: headline → photo (full width, -mt-10 under headline) → lede → button; sticker pinned over photo corner
```

- **Photo plate:** Pexels doesn't supply transparent cut-outs, so the hero photo sits inside a circular `bg-crema` plate (`rounded-full p-3 md:p-4`, photo `rounded-full object-cover`), and `drop-shadow-cup` goes on the plate.

- **Headline:** `<h1 className="font-display text-hero text-ink">`, broken into short lines by hand with `<br />` at phrase boundaries. Keep it to 3–5 words.
- **Photo:** `next/image` with `priority` and `sizes="(min-width:1024px) 45vw, 90vw"`, `relative z-10` so it sits over the headline, and `drop-shadow-cup`.
- **Lede:** `text-lede text-ink-muted max-w-[34ch]`.
- **BeanScatter:** `absolute inset-0 pointer-events-none`, with 8–14 bean images at random scale (0.5–1.4) and blur (0–3px). Larger beans get more blur.
- **No** stat strips, gradient blobs or entrance animation.

---

### PourRibbon

`components/PourRibbon.tsx` (**client**, for the pause toggle). This is the signature element, from *The Daily Pour 3*.

- **Structure:** one or two full-bleed green bands, each a marquee of `[BeanGlyph] Doppio [✱] Flat white [✱] …`. The list is duplicated once so the `translateX(-50%)` loop is seamless.
- **Band:** `bg-brand text-ink-on-brand h-16 md:h-20 shadow-ribbon`, wrapped in `overflow-hidden` with `-rotate-[4deg]` and `-mx-[5%]` so it bleeds past the frame edges at an angle.
- **Second band** (optional): sits behind the first, `rotate-[3deg]`, `bg-roastery-deep`, `animate-ribbon-reverse`, at 85% opacity.
- **Items:** drink names in `font-display text-title md:text-heading`, separated by a crema `✱` asterisk (`text-highlight`). Every third separator is a crema BeanGlyph in a white circle (as in the reference).
- **Motion:** `animate-ribbon` on the inner track, with `hover:[animation-play-state:paused]` and `focus-within:[animation-play-state:paused]`. Under reduced motion the track is static.
- **Pause control:** a `size-11` round button at the band's right end ("Pause ribbon" / "Play ribbon", `aria-pressed`). This satisfies WCAG 2.2.2.
- **A11y:** the moving track is `aria-hidden`. If the ribbon's items are meaningful links, render a visually hidden `<ul>` of the same links once.
- **Placement:** between the hero and the next section, at most once per page.

---

### TagCloud

`components/TagCloud.tsx` is the "Coffee by category" section: a loose pile of [DrinkTag](#drinktag)s, as if tipped out of a jar.

- **Heading:** `font-display text-section md:text-pour-xl text-ink text-center`, for example "What are you having?"
- **Layout:** `flex flex-wrap justify-center gap-x-1 gap-y-0` with negative margins (`-my-1`) so tags jostle and overlap slightly. Each tag gets a `tilt` from a fixed, seeded list (not `Math.random()`, which causes hydration mismatches): mostly ±4–12°, with one or two at ±80° for verticals. Sprinkle bean tags in every 4–5 items.
- **Behaviour:** in `filter` mode it filters the menu below. Selected tags straighten to 0°, so the change is visible beyond the colour alone.
- **Mobile:** verticals rotate back to ±12° below `sm` to save height.

---

### DrinkCard

`components/DrinkCard.tsx`, from the Onea product row.

```
   ╭──────╮
  ╱  cup   ╲      Caramel
 │  photo   │     cortado
  ╲ ▓▓▓▓▓▓ ╱      £3.40
   ╰──────╯
```

- **Layout:** `grid grid-cols-[auto_1fr] items-start gap-5`. There's no card box, border or shadow. The plate is the container.
- **Plate:** `size-28 md:size-32 rounded-full p-1.5`, with the fill rotating through `bg-crema`, `bg-roast/85`, `bg-roastery` and `bg-latte` by index. The Pexels photo sits inside as a `rounded-full object-cover` circle, so the plate shows as a coloured rim.
- **Name:** `text-title font-bold text-ink`, at most two lines. Price: [Price](#price) card style. Then the description in `text-small text-ink-muted`, and a `text-fine` meta line ("Vegetarian · Contains milk, soy"). Allergens are always written out, never shown by colour or icon alone.
- **Element:** an `<article>`, not a link. There are no item pages.
- **Unavailable:** the photo is shown with `grayscale opacity-60`, and the price is replaced by "Back tomorrow" in `text-small text-ink-muted`.
- **Grid of cards:** `grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3`.

---

### CategoryRail

`components/CategoryRail.tsx` is the vertical list of round category icons beside the hero (Onea reference). On mobile it becomes a horizontal scroller.

- **Item:** a `size-16` circle (`bg-crema`, `bg-roastery`, `bg-hot` or `bg-latte`, rotating through, `p-1`) holding a round photo of a typical item, with a `text-small font-bold` label beneath in sentence case ("Coffee", "Tea", "Bakery"). The photo is decorative (`alt=""`), because the label names the link.
- **Container:** on the menu page it runs horizontally above the sections: `flex gap-5 overflow-x-auto snap-x` on mobile, wrapping with `gap-8` from `md`.
- **Each item** is an in-page anchor to its category section (`#coffee`, `#lunch`). On hover, the circle rotates 6°.

---

### EventCard

`components/UpcomingEvents.tsx` renders the next four events (open mic on Fridays, the coffee tasting on Saturdays) from `lib/events.ts`. The list depends on today's date, so it uses `'use cache'` with `cacheLife("hours")`.

- **Grid:** `grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4`.
- **Photo:** Pexels photo in an `aspect-[4/3] rounded-panel` frame.
- **Date chip:** a pill in the DrinkTag style (`border-2 border-line bg-raised font-display`, `min-h-11`), pinned to the photo's top-left corner and tilted by a fixed per-index amount. It wraps a `<time>`.
- **Text:** title `text-title font-bold`, then date and time in `text-small font-medium`, then the blurb and a practical note ("Sign-up sheet at the counter from 6:30pm") in `text-small text-ink-muted`.
- **Action:** the tasting card has a secondary `sm` "Reserve a table" button, which opens the ReserveDialog with that Saturday at 10am already filled in.

---

### ReserveDialog

`components/ReserveDialog.tsx` (**client**), opened through `ReserveProvider` / `useReservation()` from any `ReserveButton` or the ReserveSticker. One dialog serves the whole site.

- **Element:** a native `<dialog>` opened with `showModal()`, which gives focus trapping, Esc to close and an inert page behind it. A backdrop click also closes it. `rounded-panel bg-raised shadow-lift`, `w-[min(100%-2rem,34rem)]`, backdrop `bg-espresso/60`.
- **Title:** "Reserve a table" in `text-heading font-bold` (it's under 36px, so not the display face).
- **Fields** ([TextField and SelectField](#textfield-and-searchfield)): Name; Party size (select 1–8, helper "For more than 8, call the shop."); Date (`type="date"`, today to 60 days ahead); Time (select of 30-minute slots for the chosen day, from opening until an hour before close).
- **Submit:** a primary `lg` Button, "Reserve a table". While pending it reads "Reserving…" with `aria-busy`.
- **Validation:** a Server Action (`app/actions/reserve.ts`) checks every field against `lib/hours.ts`, which the form also uses for its slots. Errors show per field, and a one-line `role="alert"` summary sits above the form.
- **Success:** the form is replaced by a `role="status"` confirmation using the same verb: "Table reserved for 4, Saturday, November 7 at 10am. See you then, Maya." Below it is a primary "Done" button.
- Nothing is stored or sent yet. The action is where email or a database would plug in.

---

### SiteFooter

`components/SiteFooter.tsx` is the closing band from *The Daily Pour 3*: beans tumbling into green, then a big invitation to visit.

- **Top edge:** a few crema BeanGlyphs scattered across the boundary at fixed positions (`aria-hidden`).
- **Band:** `bg-brand text-ink-on-brand pt-24 md:pt-32 pb-16`. The frame's `overflow-clip` rounds its bottom corners.
- **Headline:** `font-display text-feature md:text-pour-xl text-highlight text-center`, reading "Pull up a chair". Below it is an on-brand `lg` "Reserve a table" button and a `text-small` line of hours.
- **Bottom row:** address and phone, links to Menu and About us, and a "Photos from Pexels" credit, in `text-small text-ink-on-brand/80`.

---

### Empty and error states

| Situation | Copy | Action |
|---|---|---|
| Empty basket | "Your basket is empty. Today's pour is a Guatemalan filter, bright and a bit like red apple." | Button: "Browse the menu" |
| No search results | "Nothing called 'matchaa' on the menu. Check the spelling, or try 'matcha'." | Clear search |
| Shop closed | "Closed until 7am. You can still order for tomorrow morning." | Button: "Order for tomorrow" |
| Payment failed | "Card declined. Try another card or pay in store." | Retry, change card |
| Page not found | Headline (display): "This cup's empty." Body: "The page you're after doesn't exist." | Button: "Back to the menu" |

- **Layout:** left-aligned inside the content column, with a single BeanGlyph (48px, `text-line`) above the copy. Don't use illustrations or emoji.
- Failures use `role="alert"` and `text-hot` only for the one-line summary, with body text staying `text-ink`.

---

## Checklist for new components

- [ ] Uses semantic tokens, and looks right under `data-theme="dark"`
- [ ] Hit areas are at least 44px, keyboard reachable, and the global focus ring is visible (not clipped by `overflow-hidden` or SVG shapes)
- [ ] Any rotation is on a wrapper and decorative only
- [ ] It's a Server Component unless it needs state or events
- [ ] Copy is sentence case, the verb matches the flow, and there are no arrows or emoji in controls
- [ ] It isn't competing with the page's one loud thing
