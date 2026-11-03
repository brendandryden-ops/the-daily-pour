import Image from "next/image";
import { menuPhotos } from "@/lib/images";
import { categoryId, type Category } from "@/lib/menu";

const PLATES = ["bg-crema", "bg-roastery", "bg-hot", "bg-latte"];

/** The photo that stands for each category in the rail. */
const CATEGORY_PHOTO: Record<Category, string> = {
  Coffee: "flat-white",
  Tea: "matcha-latte",
  Drinks: "hot-chocolate",
  Bakery: "almond-croissant",
  Lunch: "avocado-toast",
};

/** Round category links that jump down the menu page. Scrolls sideways on small screens. */
export function CategoryRail({ categories }: { categories: Category[] }) {
  return (
    <nav aria-label="Menu categories">
      <ul className="-mx-5 flex snap-x gap-5 overflow-x-auto px-5 py-2 md:mx-0 md:flex-wrap md:gap-8 md:overflow-visible md:px-0">
        {categories.map((category, i) => {
          const photo = menuPhotos[CATEGORY_PHOTO[category]];
          return (
            <li key={category} className="snap-start">
              <a
                href={`#${categoryId(category)}`}
                className="group flex w-20 flex-col items-center gap-2 rounded-panel text-center"
              >
                <span
                  className={`relative block size-16 overflow-hidden rounded-full p-1 transition-transform duration-300 ease-pour group-hover:rotate-6 ${PLATES[i % PLATES.length]}`}
                >
                  <span className="relative block size-full overflow-hidden rounded-full">
                    <Image src={photo.src} alt="" fill sizes="64px" className="object-cover" />
                  </span>
                </span>
                <span className="text-small font-bold text-ink">{category}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
