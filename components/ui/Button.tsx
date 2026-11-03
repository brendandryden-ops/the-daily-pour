import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

type Variant = "primary" | "secondary" | "on-brand" | "destructive";
type Size = "sm" | "md" | "lg";

const base =
  "relative inline-flex items-center justify-center gap-2 rounded-full whitespace-nowrap transition-[background-color,transform] duration-150 ease-pour active:translate-y-px aria-disabled:cursor-not-allowed aria-disabled:opacity-45 aria-disabled:active:translate-y-0";

const variants: Record<Variant, string> = {
  primary:
    "bg-inverse text-ink-inverse hover:bg-[color-mix(in_oklab,var(--surface-inverse),black_18%)] aria-disabled:hover:bg-inverse",
  secondary:
    "border-2 border-ink text-ink bg-transparent hover:bg-highlight-soft aria-disabled:hover:bg-transparent",
  "on-brand": "bg-highlight text-espresso hover:bg-[#ffc93a] aria-disabled:hover:bg-highlight",
  destructive:
    "bg-hot text-foam hover:bg-[color-mix(in_oklab,var(--hot),black_10%)] aria-disabled:hover:bg-hot",
};

const sizes: Record<Size, string> = {
  // 40px tall, with the hit area padded out to 44px.
  sm: "h-10 px-4 text-small font-bold before:absolute before:inset-x-0 before:-inset-y-0.5 before:content-['']",
  md: "h-12 px-6 text-body font-bold",
  lg: "h-14 px-8 text-title font-bold",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
  className?: string;
  children: ReactNode;
};

export type ButtonProps = CommonProps &
  Omit<ComponentPropsWithoutRef<"button">, keyof CommonProps> & { href?: undefined };
type LinkProps = CommonProps &
  Omit<ComponentPropsWithoutRef<typeof Link>, keyof CommonProps> & { href: string };

export function buttonClasses({
  variant = "primary",
  size = "md",
  className = "",
}: Pick<CommonProps, "variant" | "size" | "className"> = {}) {
  return `${base} ${variants[variant]} ${sizes[size]} ${className}`;
}

export function Button(props: ButtonProps | LinkProps) {
  const { variant, size, icon, className, children, ...rest } = props;
  const classes = buttonClasses({ variant, size, className });
  const content = (
    <>
      {children}
      {icon ? <span className="size-5 shrink-0">{icon}</span> : null}
    </>
  );

  if (rest.href !== undefined) {
    return (
      <Link {...(rest as Omit<LinkProps, keyof CommonProps>)} className={classes}>
        {content}
      </Link>
    );
  }

  const { type = "button", ...buttonRest } = rest as Omit<ButtonProps, keyof CommonProps>;
  return (
    <button type={type} {...buttonRest} className={classes}>
      {content}
    </button>
  );
}
