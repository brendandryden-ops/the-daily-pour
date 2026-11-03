import { readFile } from "node:fs/promises";
import path from "node:path";
import { cacheLife } from "next/cache";

export const CATEGORIES = ["Coffee", "Tea", "Drinks", "Bakery", "Lunch"] as const;
export type Category = (typeof CATEGORIES)[number];

export type MenuItem = {
  id: number;
  slug: string;
  name: string;
  category: Category;
  description: string;
  priceCents: number;
  dietary: string | null;
  allergens: string[];
  caffeine: string;
  available: boolean;
  featured: boolean;
};

const MENU_PATH = path.join(process.cwd(), "Docs", "menu-items.csv");

/** Splits CSV text into rows of fields. Handles quoted fields with commas and "" escapes. */
function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (quoted) {
      if (char === '"' && text[i + 1] === '"') {
        field += '"';
        i++;
      } else if (char === '"') {
        quoted = false;
      } else {
        field += char;
      }
    } else if (char === '"') {
      quoted = true;
    } else if (char === ",") {
      row.push(field);
      field = "";
    } else if (char === "\n" || char === "\r") {
      if (char === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      if (row.some((value) => value !== "")) rows.push(row);
      row = [];
      field = "";
    } else {
      field += char;
    }
  }
  row.push(field);
  if (row.some((value) => value !== "")) rows.push(row);
  return rows;
}

export async function getMenu(): Promise<MenuItem[]> {
  "use cache";
  cacheLife("days");

  const [header, ...rows] = parseCsv(await readFile(MENU_PATH, "utf8"));
  const column = (name: string) => header.indexOf(name);

  return rows.map((row) => {
    const get = (name: string) => row[column(name)]?.trim() ?? "";
    const category = get("category") as Category;
    if (!CATEGORIES.includes(category)) {
      throw new Error(`Unknown menu category "${category}" for ${get("slug")}`);
    }
    return {
      id: Number(get("id")),
      slug: get("slug"),
      name: get("name"),
      category,
      description: get("description"),
      priceCents: Number(get("price_cents")),
      dietary: get("dietary") || null,
      allergens: get("allergens").split(";").filter(Boolean),
      caffeine: get("caffeine"),
      available: get("available") === "true",
      featured: get("featured") === "true",
    };
  });
}

export async function getMenuByCategory() {
  const menu = await getMenu();
  return CATEGORIES.map((category) => ({
    category,
    items: menu.filter((item) => item.category === category),
  })).filter((group) => group.items.length > 0);
}

export async function getFeatured() {
  const menu = await getMenu();
  return menu.filter((item) => item.featured && item.available);
}

export function categoryId(category: Category) {
  return category.toLowerCase();
}
