import type { Metadata } from "next";

import { LiquidMetalButton } from "@/components/ui/liquid-metal-button";

export const metadata: Metadata = {
  title: "Playground",
  robots: { index: false },
};

/** The 21st.dev demo for the Liquid Metal Button, kept as a test bed for components. */
export default function PlaygroundPage() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-8 p-8">
      <h1 className="font-mono text-xs tracking-[0.12em] text-muted-foreground">PLAYGROUND · LIQUID METAL BUTTON</h1>
      <div className="flex items-center gap-8">
        <LiquidMetalButton label="Get Started" />
        <LiquidMetalButton viewMode="icon" label="Sparkle" />
      </div>
    </main>
  );
}
