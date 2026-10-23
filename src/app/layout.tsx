import type { Metadata } from "next";
import { Fraunces, Source_Sans_3 } from "next/font/google";
import { PostHogProvider } from "@/components/PostHogProvider";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

const sourceSans = Source_Sans_3({
  variable: "--font-sans",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Vinalia — vignerons de Loire",
    template: "%s · Vinalia",
  },
  description:
    "Carte et fiches des domaines viticoles de Loire : appellations, communes et cuvées.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fr"
      className={`${sourceSans.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background font-sans text-foreground">
        <PostHogProvider>
          <SiteHeader />
          {children}
        </PostHogProvider>
      </body>
    </html>
  );
}
