/**
 * Every photo on the site, all from Pexels (free to use, no attribution required,
 * but we credit Pexels in the footer). The files are self-hosted WebP copies in
 * public/images, made with the optimize-image skill. To swap a photo, re-run the
 * skill with the new id and the same name, then update the id here.
 */
export type Photo = {
  src: string;
  alt: string;
  /** The photo's page on Pexels. */
  pexelsUrl: string;
};

/** `name` is the file in public/images; `id` is the original on Pexels. */
function pexels(name: string, id: number, alt: string): Photo {
  return {
    src: `/images/${name}.webp`,
    alt,
    pexelsUrl: `https://www.pexels.com/photo/${id}/`,
  };
}

export const menuPhotos: Record<string, Photo> = {
  espresso: pexels("espresso", 1233528, "Espresso with crema in a small glass cup"),
  doppio: pexels("doppio", 26626461, "A double espresso in a short glass beside scattered coffee beans"),
  cortado: pexels("cortado", 9249368, "A small cortado with latte art on a café table"),
  "caramel-cortado": pexels("caramel-cortado", 5305639, "A caramel coffee in a glass beside bottles of syrup"),
  "flat-white": pexels("flat-white", 12703064, "A flat white with a tulip of latte art, seen from above"),
  cappuccino: pexels("cappuccino", 186857, "A cappuccino with latte art on a wooden table"),
  "oat-latte": pexels("oat-latte", 13623762, "A latte with leaf art in a white cup and saucer"),
  americano: pexels("americano", 1727123, "Black coffee in a white cup and saucer, seen from above"),
  mocha: pexels("mocha", 7994278, "A mocha in a glass mug topped with chocolate shavings"),
  "red-eye": pexels("red-eye", 324028, "Espresso pouring from a machine into two cups"),
  "todays-pour": pexels("todays-pour", 29498509, "Filter coffee brewing through a pour-over dripper"),
  "iced-latte": pexels("iced-latte", 6328977, "Milk swirling into an iced coffee in a glass"),
  "cold-brew": pexels("cold-brew", 2775860, "Cold brew over ice in a cut-glass tumbler"),
  "english-breakfast": pexels("english-breakfast", 15675493, "A cup of black tea beside a patterned teapot"),
  "chai-latte": pexels("chai-latte", 11588452, "A chai latte dusted with cinnamon in a glass mug"),
  "matcha-latte": pexels("matcha-latte", 32938765, "A matcha latte with leaf art in a white cup"),
  "hot-chocolate": pexels("hot-chocolate", 239584, "Hot chocolate topped with marshmallows"),
  "almond-croissant": pexels("almond-croissant", 3892469, "A golden croissant on a wooden board"),
  "cinnamon-bun": pexels("cinnamon-bun", 9443534, "A sugar-dusted cinnamon bun on a plate"),
  "banana-bread": pexels("banana-bread", 2013804, "A stack of banana bread slices on a plate"),
  "cheese-scone": pexels("cheese-scone", 7686487, "Freshly baked scones on a tray"),
  "grilled-cheese": pexels("grilled-cheese", 14941252, "A toasted grilled cheese sandwich cut in half"),
  "soup-of-the-day": pexels("soup-of-the-day", 17302314, "A bowl of tomato soup with basil and bread"),
  "avocado-toast": pexels("avocado-toast", 4109530, "Avocado toast with poached eggs and salad leaves"),
  "grain-salad": pexels("grain-salad", 9893127, "A colourful grain salad with cashews and red pepper"),
  "turkey-on-rye": pexels("turkey-on-rye", 17942170, "A turkey sandwich on dark seeded rye"),
};

export const photos = {
  /** Framed in the hero, overlapping the headline; the splash needs to sit in the top half. */
  hero: pexels("hero", 4281788, "Milky coffee splashing up out of a white mug"),
  about: {
    room: pexels("about-room", 34094296, "A warm coffee shop interior with wooden shelves and a tall window"),
    counter: pexels("about-counter", 34153867, "A wooden coffee counter with shelves of cups behind it"),
    table: pexels("about-table", 2074130, "Friends sharing coffee and pastries around a wooden table"),
  },
  events: {
    "open-mic": pexels("events-open-mic", 6670752, "A musician singing and playing acoustic guitar indoors"),
    tasting: pexels("events-tasting", 34505585, "Cupping bowls and tasting spoons laid out on a wooden table"),
  },
} as const;
