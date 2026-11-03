# The Daily Pour design system

This folder is the design system for The Daily Pour's site, built for Next.js 16 (App Router), React 19, Tailwind CSS v4 and TypeScript.

| File | What's in it |
|---|---|
| [style-guide.md](style-guide.md) | Principles, colour, type, layout, imagery, motion, voice and the accessibility floor: the *why* |
| [tokens.css](tokens.css) | Every colour, type size, radius, shadow and animation as Tailwind v4 `@theme` tokens: the *what* |
| [components.md](components.md) | Specs for each component, with props, states, classes and accessibility notes: the *how* |
| [References/](References/) | The three moodboard images the system was derived from |

## The system at a glance

- **Palette:** Espresso `#3E1A0D` on Steamed milk `#FAF3E6`, with Roastery green `#143D2C` for brand surfaces, Crema `#F4B81C` for highlights on green, and Roast red `#B0360F` for the order sticker only.
- **Type:** Bagel Fat One for display (36px and up) and Gabarito for everything else.
- **Signature:** the tilted, slowly scrolling green *pour ribbon*. Everything else stays calm around it.
- **Dark theme:** "Late shift", a roasted-brown theme that follows the OS setting or `data-theme` on `<html>`.

## Wiring it into the app

The app still runs the create-next-app defaults. To adopt the system:

1. **Tokens.** In `app/globals.css`, replace everything after `@import "tailwindcss";` with:
   ```css
   @import "../Docs/Design/tokens.css";
   ```
   (Or move `tokens.css` to `app/tokens.css` and import `./tokens.css`. This keeps a single source either way.)
2. **Fonts.** In `app/layout.tsx`, swap Geist for `Bagel_Fat_One` and `Gabarito` from `next/font/google`, exposing `--font-bagel` and `--font-gabarito`. The snippet is in [style-guide.md › Typography](style-guide.md#3-typography).
3. **Frame.** Give `<body>` the gutter padding and wrap `children` in `<PageFrame>` ([components.md › PageFrame](components.md#pageframe)).
4. **Metadata.** Update `title` and `description` in `layout.tsx` from the create-next-app defaults.

Tailwind is compiled through `@tailwindcss/turbopack` (see `next.config.ts`), so no PostCSS config is needed.

## Changing the system

Change a value in `tokens.css` and nowhere else. If a component needs a colour or size that isn't a token, raise it as a design question before adding a one-off arbitrary value.
