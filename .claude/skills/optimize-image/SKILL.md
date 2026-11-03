---
name: optimize-image
description: Download an image from a URL (Pexels, Unsplash or any direct image link), resize it for the web and convert it to WebP in the public folder so the site serves it locally. Use when the user wants to download, localise, self-host or optimise stock photos, swap a remote image URL for a local file, or add a new photo to the site.
---

# Optimize image

Downloads a remote image, resizes it to a web-friendly width (it never upscales), converts it to WebP, strips the metadata and saves it to `public/images/<name>.webp`. The site then serves it as `/images/<name>.webp`.

The work is done by [scripts/optimize-image.mjs](scripts/optimize-image.mjs), which uses `sharp`. Next.js already pulls `sharp` in. If the script says it's missing, run `npm install --save-dev sharp`.

## Usage

Run it from the project root:

```bash
# One image
node .claude/skills/optimize-image/scripts/optimize-image.mjs <url> --name <slug> [--width 1600] [--quality 80]

# Many images at once
node .claude/skills/optimize-image/scripts/optimize-image.mjs --manifest <file.json>
```

- `<url>` can be a direct image URL, a Pexels photo page (`https://www.pexels.com/photo/some-slug-12345/`) or a bare Pexels photo id (`12345`). For Pexels, the script asks the CDN for the target width, so it doesn't download the multi-megabyte original.
- `--name` is the output filename without the extension. It's turned into kebab-case.
- `--width` is the maximum output width in pixels. The default is 1600.
- `--quality` is the WebP quality from 1 to 100. The default is 80.
- `--out` is the output folder. The default is `public/images`.
- `--force` overwrites an existing file. Without it, existing files are skipped.

A manifest is a JSON array. Put it in the scratchpad or temp directory, not in the repo:

```json
[
  { "url": "1233528", "name": "espresso", "width": 800 },
  { "url": "https://www.pexels.com/photo/4281788/", "name": "hero", "width": 1920 }
]
```

The script prints each saved file's dimensions, its size before and after, and the `src` to use. It exits non-zero if any image failed.

## Choosing a width

Pick the largest size the image is shown at on a 2x screen, rounded to a common width:

| Use | `--width` |
|---|---|
| Full-bleed hero or banner | 1920 |
| Large content image (about page, feature) | 1200–1600 |
| Card or menu thumbnail | 800 |
| Small avatar or icon-sized image | 400 |

Keep the quality at 80 unless the user asks for otherwise. Use 85–90 for a hero where banding shows, and 70 for thumbnails.

## Workflow

1. **Collect the images.** In this project every photo is listed in `lib/images.ts`, built by the `pexels(id, alt)` helper. Read it to get the ids, and name each file after its key (`espresso`, `about-room`, `events-open-mic`).
2. **Run the script.** For more than two or three images, write a manifest and run it once.
3. **Check the output.** Make sure every job succeeded and the files look reasonable in size (most should be under 300 KB). Re-run any failures, or report them.
4. **Point the code at the local files.** Only do this if the user wants the site switched over. Change each `src` to `/images/<name>.webp`. In `lib/images.ts`, change the helper so it builds the local path, and keep `pexelsUrl` for credit. Once nothing references `images.pexels.com`, remove the `remotePatterns` entry from `next.config.ts`. `next/image` needs `width`/`height` or `fill` for a string `src`; the script prints the dimensions.
5. **Report back.** List the files written, the total size, and any code changes.

## Notes

- Downloaded bytes are untrusted. The script only decodes them with sharp and never executes them. It rejects responses that aren't `image/*` and anything over 40 MB.
- Pexels and Unsplash photos are free to use, but keep the credit the site already gives (the footer links to Pexels).
- Don't use this to pull images from sites whose licence doesn't allow re-hosting. Ask first if the source isn't a stock-photo site.
