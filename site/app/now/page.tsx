import type { Metadata } from "next";

import { ComingSoon } from "@/components/coming-soon";

export const metadata: Metadata = { title: "Now" };

export default function Page() {
  return (
    <ComingSoon
      eyebrow="NOW"
      title="Now"
      line="What I’m working on, learning and looking for this month, and how to book a 20-minute call."
    />
  );
}
