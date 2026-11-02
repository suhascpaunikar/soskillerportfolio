import type { Metadata } from "next";

import { ComingSoon } from "@/components/coming-soon";

export const metadata: Metadata = { title: "Lab" };

export default function Page() {
  return (
    <ComingSoon
      eyebrow="LAB"
      title="Lab"
      line="Fidle.app, a visual-effects playground built with Claude Code, plus four product concepts: YouTube × Google Maps, Swiggy Ad Discount, Noon AI Search and CRED Milestones."
    />
  );
}
