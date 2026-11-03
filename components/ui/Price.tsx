const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

type PriceProps = {
  /** Amount in cents. */
  cents: number;
  variant?: "list" | "card";
  className?: string;
};

const styles = {
  list: "text-small text-ink-muted",
  card: "text-body text-hot",
};

export function formatPrice(cents: number) {
  return usd.format(cents / 100);
}

export function Price({ cents, variant = "card", className = "" }: PriceProps) {
  return (
    <span className={`font-sans font-bold tabular-nums ${styles[variant]} ${className}`}>
      {formatPrice(cents)}
    </span>
  );
}
