import { Container } from "@/components/PageFrame";
import { BeanGlyph } from "@/components/ui/BeanGlyph";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <Container className="flex flex-col items-start gap-6 py-24 md:py-32">
      <BeanGlyph className="size-12 text-line" />
      <h1 className="font-display text-feature text-ink md:text-pour-xl">This cup&rsquo;s empty.</h1>
      <p className="max-w-[52ch] text-lede text-ink-muted">The page you&rsquo;re after doesn&rsquo;t exist.</p>
      <Button href="/menu">Back to the menu</Button>
    </Container>
  );
}
