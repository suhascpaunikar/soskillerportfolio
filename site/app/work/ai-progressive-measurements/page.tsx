import type { Metadata } from "next";

import { ComingSoon } from "@/components/coming-soon";

export const metadata: Metadata = { title: "AI progressive measurements" };

export default function Page() {
  return (
    <ComingSoon
      eyebrow="CASE STUDY · LENSKART"
      title="AI progressive measurements"
      line="An iPad flow that lets any store staff member take progressive-lens measurements: 15–20 minutes down to 3–5, live nationwide."
    />
  );
}
