import type { Metadata, Viewport } from "next";
import "@fontsource-variable/hanken-grotesk";
import "@fontsource-variable/jetbrains-mono";
import "@fontsource/instrument-serif/400.css";
import "@fontsource/instrument-serif/400-italic.css";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Suhas Paunikar · Product designer",
    template: "%s · Suhas Paunikar",
  },
  description:
    "Product designer for commerce, retail and AI tools, most recently at Lenskart. I used to cut films. Now I cut checkout flows.",
};

export const viewport: Viewport = {
  themeColor: "#0d0d0f",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="dark h-full">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
