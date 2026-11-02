import type { Metadata } from "next";

import { ComingSoon } from "@/components/coming-soon";

export const metadata: Metadata = { title: "About" };

export default function Page() {
  return (
    <ComingSoon
      eyebrow="PREVIOUSLY ON…"
      title="About"
      line="Seven seasons: film editor, cloud-kitchen founder, product designer. One card each, with what it taught me."
    />
  );
}
