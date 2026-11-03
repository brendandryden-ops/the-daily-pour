import type { Metadata } from "next";
import { CategoryRail } from "@/components/CategoryRail";
import { DrinkCard } from "@/components/DrinkCard";
import { Container } from "@/components/PageFrame";
import { categoryId, getMenuByCategory, type Category } from "@/lib/menu";

export const metadata: Metadata = {
  title: "Menu",
  description:
    "Specialty coffee, loose-leaf tea, pastries baked every morning and light lunches at The Daily Pour in Brooklyn.",
};

const CATEGORY_NOTES: Record<Category, string> = {
  Coffee: "House espresso roasted on Tuesdays. Oat milk at no extra charge.",
  Tea: "Loose leaf, brewed to order.",
  Drinks: "For the ones who don't do caffeine.",
  Bakery: "Baked in our kitchen from 6am. When they're gone, they're gone.",
  Lunch: "Served from 11am until the kitchen closes at 3pm.",
};

export default async function MenuPage() {
  const groups = await getMenuByCategory();

  return (
    <Container className="flex flex-col gap-16 pt-6 pb-16 md:pt-10 md:pb-24">
      <header className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <h1 className="font-display text-feature text-ink md:text-pour-xl">The menu</h1>
          <p className="max-w-[52ch] text-lede text-ink-muted">
            Everything we pour, bake and plate. Ask at the counter if you&rsquo;d like something changed.
          </p>
        </div>
        <CategoryRail categories={groups.map((group) => group.category)} />
      </header>

      {groups.map(({ category, items }) => (
        <section
          key={category}
          id={categoryId(category)}
          aria-labelledby={`${categoryId(category)}-heading`}
          className="flex scroll-mt-6 flex-col gap-10 border-t-2 border-line pt-12"
        >
          <div className="flex flex-col gap-2 md:flex-row md:items-baseline md:justify-between md:gap-10">
            <h2 id={`${categoryId(category)}-heading`} className="font-display text-section text-ink">
              {category}
            </h2>
            <p className="text-body text-ink-muted">{CATEGORY_NOTES[category]}</p>
          </div>
          <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item, i) => (
              <DrinkCard key={item.slug} item={item} index={i} />
            ))}
          </div>
        </section>
      ))}

      <p className="max-w-[62ch] text-fine text-ink-muted">
        Allergens are listed under each item. Our kitchen handles gluten, milk, eggs, nuts, soy, celery and
        mustard, so we can&rsquo;t promise anything is free from traces. If you have an allergy, tell us when
        you order.
      </p>
    </Container>
  );
}
