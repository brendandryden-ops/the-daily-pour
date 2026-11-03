type BeanGlyphProps = {
  className?: string;
  /** Give the bean an accessible name; it's decorative otherwise. */
  label?: string;
};

/** The one brand icon: a coffee bean. Inherits colour from `currentColor`. */
export function BeanGlyph({ className = "size-5", label }: BeanGlyphProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      aria-hidden={label ? undefined : true}
      role={label ? "img" : undefined}
      aria-label={label}
      focusable="false"
    >
      <path
        fillRule="evenodd"
        transform="rotate(-30 12 12)"
        d="M12 2.5c4.6 0 8 4.3 8 9.5s-3.4 9.5-8 9.5-8-4.3-8-9.5 3.4-9.5 8-9.5Zm1.3 2.1c-2.9 2.3-3.5 5-1.8 7.6 1.4 2.2 1.1 4.5-1 7.1l.9.4c2.3-2.8 2.6-5.5 1-8-1.5-2.3-1-4.5 1.6-6.5l-.7-.6Z"
      />
    </svg>
  );
}
