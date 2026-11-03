import type { Metadata } from "next";
import { Bagel_Fat_One, Gabarito } from "next/font/google";
import { PageFrame } from "@/components/PageFrame";
import { ReserveProvider } from "@/components/ReserveProvider";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import "./globals.css";

const bagel = Bagel_Fat_One({
  variable: "--font-bagel",
  weight: "400",
  subsets: ["latin"],
});

const gabarito = Gabarito({
  variable: "--font-gabarito",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "The Daily Pour · Coffee in Brooklyn",
    template: "%s · The Daily Pour",
  },
  description:
    "A neighbourhood coffee shop in Brooklyn. Specialty coffee, fresh pastries and light lunches, with open mic on Fridays and coffee tastings on Saturdays.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${bagel.variable} ${gabarito.variable} h-full antialiased`}
    >
      <body className="min-h-full px-3 pt-3 md:p-5 lg:p-7">
        <ReserveProvider>
          <PageFrame>
            <SiteHeader />
            <main className="flex-1">{children}</main>
            <SiteFooter />
          </PageFrame>
        </ReserveProvider>
      </body>
    </html>
  );
}
