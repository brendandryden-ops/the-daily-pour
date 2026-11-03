import { DrinkCard } from "@/components/DrinkCard";
import { Hero } from "@/components/Hero";
import { Container } from "@/components/PageFrame";
import { PourRibbon } from "@/components/PourRibbon";
import { UpcomingEvents } from "@/components/UpcomingEvents";
import { Button } from "@/components/ui/Button";
import { getFeatured, getMenu } from "@/lib/menu";

export default async function Home() {
  const [featured, menu] = await Promise.all([getFeatured(), getMenu()]);
  const ribbonItems = menu
    .filter((item) => item.available && ["Coffee", "Tea", "Bakery"].includes(item.category))
    .slice(0, 12)
    .map((item) => item.name);

  return (
    <>
      <Hero />
      <PourRibbon items={ribbonItems} />

      <Container as="section" className="flex flex-col gap-10 py-16 md:py-24">
        <div className="flex flex-col gap-4">
          <h2 className="font-display text-section text-ink md:text-feature">What the regulars order</h2>
          <p className="max-w-[52ch] text-lede text-ink-muted">
            The cups and plates that go out most mornings. Everything else is on the full menu.
          </p>
        </div>
        <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((item, i) => (
            <DrinkCard key={item.slug} item={item} index={i} />
          ))}
        </div>
        <Button href="/menu" variant="secondary" className="self-start">
          See the full menu
        </Button>
      </Container>

      <Container as="section" className="scroll-mt-6 py-16 md:py-24">
        <div id="events" className="flex scroll-mt-6 flex-col gap-10">
          <div className="flex flex-col gap-4">
            <h2 className="font-display text-section text-ink md:text-feature">What&rsquo;s on</h2>
            <p className="max-w-[52ch] text-lede text-ink-muted">
              Open mic every Friday evening and a coffee tasting every Saturday morning. Come for one,
              stay for a refill.
            </p>
          </div>
          <UpcomingEvents />
        </div>
      </Container>
    </>
  );
}
