import type { ReactNode } from "react";

/** The rounded milk page that sits inside the green gutter painted by <body>. */
export function PageFrame({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-[calc(100dvh-0.75rem)] flex-col overflow-clip rounded-frame bg-page max-md:rounded-b-none md:min-h-[calc(100dvh-2.5rem)] lg:min-h-[calc(100dvh-3.5rem)]">
      {children}
    </div>
  );
}

/** The content column. Full-bleed sections (ribbon, footer) sit outside it. */
export function Container({
  children,
  className = "",
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "header" | "article";
}) {
  return <Tag className={`mx-auto w-full max-w-[78rem] px-5 md:px-10 lg:px-16 ${className}`}>{children}</Tag>;
}
