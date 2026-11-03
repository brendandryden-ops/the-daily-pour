#!/usr/bin/env node
/**
 * Download an image from a URL, resize it for the web and save it as WebP.
 *
 *   node optimize-image.mjs <url> --name <slug> [--width 1600] [--quality 80] [--out public/images] [--force]
 *   node optimize-image.mjs --manifest images.json [--out public/images] [--force]
 *
 * <url> can be a direct image URL, a Pexels photo page (https://www.pexels.com/photo/some-slug-12345/)
 * or a bare Pexels photo id. A manifest is a JSON array of { "url", "name", "width"?, "quality"? }.
 * Paths are resolved against the current directory, so run it from the project root.
 */
import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";

const DEFAULT_WIDTH = 1600;
const DEFAULT_QUALITY = 80;
const DEFAULT_OUT = "public/images";
const MAX_DOWNLOAD_BYTES = 40 * 1024 * 1024;

let sharp;
try {
  sharp = (await import("sharp")).default;
} catch {
  fail("sharp is not installed. Run `npm install --save-dev sharp` in the project root.");
}

function fail(message) {
  console.error(`error: ${message}`);
  process.exit(1);
}

function parseArgs(argv) {
  const args = { positional: [] };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--force") args.force = true;
    else if (arg.startsWith("--")) {
      const value = argv[++i];
      if (value === undefined) fail(`${arg} needs a value`);
      args[arg.slice(2)] = value;
    } else args.positional.push(arg);
  }
  return args;
}

/** Lower-case kebab-case, safe to use as a filename. */
function slugify(name) {
  return String(name)
    .toLowerCase()
    .replace(/\.webp$/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Turn Pexels page links and ids into CDN URLs, asking the CDN for roughly the target width
 * so we don't download a 6000px original just to shrink it.
 */
function resolveUrl(input, width) {
  const raw = String(input).trim();
  const pexelsId =
    raw.match(/^\d+$/)?.[0] ??
    raw.match(/pexels\.com\/(?:[a-z-]+\/)?photo\/(?:[^/]*-)?(\d+)\/?/i)?.[1];
  if (pexelsId) {
    return `https://images.pexels.com/photos/${pexelsId}/pexels-photo-${pexelsId}.jpeg?cs=tinysrgb&w=${width}`;
  }
  const url = new URL(raw);
  if (url.hostname === "images.pexels.com") {
    url.search = `?cs=tinysrgb&w=${width}`;
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") fail(`unsupported URL: ${raw}`);
  return url.toString();
}

async function download(url) {
  const res = await fetch(url, { redirect: "follow", headers: { "User-Agent": "optimize-image-skill" } });
  if (!res.ok) throw new Error(`download failed: HTTP ${res.status} for ${url}`);
  const type = res.headers.get("content-type") ?? "";
  if (!type.startsWith("image/")) throw new Error(`not an image (content-type "${type}") at ${url}`);
  const length = Number(res.headers.get("content-length") ?? 0);
  if (length > MAX_DOWNLOAD_BYTES) throw new Error(`image is larger than ${MAX_DOWNLOAD_BYTES} bytes`);
  const buffer = Buffer.from(await res.arrayBuffer());
  if (buffer.length > MAX_DOWNLOAD_BYTES) throw new Error(`image is larger than ${MAX_DOWNLOAD_BYTES} bytes`);
  return buffer;
}

const kb = (bytes) => `${(bytes / 1024).toFixed(0)} KB`;

async function processOne(job, outDir, force) {
  const name = slugify(job.name ?? "");
  if (!name) throw new Error(`missing --name for ${job.url}`);
  const width = Number(job.width ?? DEFAULT_WIDTH);
  const quality = Number(job.quality ?? DEFAULT_QUALITY);
  if (!(width > 0)) throw new Error(`invalid width: ${job.width}`);
  if (!(quality > 0 && quality <= 100)) throw new Error(`invalid quality: ${job.quality}`);

  const outPath = path.join(outDir, `${name}.webp`);
  if (!force && (await stat(outPath).catch(() => null))) {
    console.log(`skip  ${name}.webp already exists (pass --force to overwrite)`);
    return { name, skipped: true };
  }

  const url = resolveUrl(job.url, width);
  const input = await download(url);
  const { data, info } = await sharp(input)
    .rotate() // apply EXIF orientation before metadata is stripped
    .resize({ width, withoutEnlargement: true })
    .webp({ quality, effort: 6 })
    .toBuffer({ resolveWithObject: true });
  await writeFile(outPath, data);

  const fromPublic = path.relative(path.resolve("public"), outPath);
  const outsidePublic = fromPublic.startsWith("..") || path.isAbsolute(fromPublic);
  const publicPath = outsidePublic ? null : "/" + fromPublic.split(path.sep).join("/");
  const src = publicPath ? `  src="${publicPath}"` : "";
  console.log(`saved ${outPath}  ${info.width}x${info.height}  ${kb(input.length)} -> ${kb(data.length)}${src}`);
  return { name, path: outPath, src: publicPath, width: info.width, height: info.height, bytes: data.length };
}

const args = parseArgs(process.argv.slice(2));
const outDir = path.resolve(args.out ?? DEFAULT_OUT);

let jobs;
if (args.manifest) {
  jobs = JSON.parse(await readFile(args.manifest, "utf8"));
  if (!Array.isArray(jobs)) fail("manifest must be a JSON array of { url, name, width?, quality? }");
} else {
  if (args.positional.length !== 1) {
    fail("usage: optimize-image.mjs <url> --name <slug> [--width 1600] [--quality 80] [--out public/images] [--force]\n" +
      "       optimize-image.mjs --manifest images.json [--out public/images] [--force]");
  }
  jobs = [{ url: args.positional[0], name: args.name, width: args.width, quality: args.quality }];
}

await mkdir(outDir, { recursive: true });

let failures = 0;
for (const job of jobs) {
  try {
    await processOne(job, outDir, args.force);
  } catch (err) {
    failures++;
    console.error(`fail  ${job.name ?? job.url}: ${err.message}`);
  }
}
console.log(`\n${jobs.length - failures}/${jobs.length} done`);
// Set exitCode rather than calling process.exit(): exiting while sharp's threads shut down crashes libuv on Windows.
process.exitCode = failures ? 1 : 0;
