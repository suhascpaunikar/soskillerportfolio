import type { Metadata } from "next";

import { ComingSoon } from "@/components/coming-soon";

export const metadata: Metadata = { title: "Pickup in store" };

export default function Page() {
  return (
    <ComingSoon
      eyebrow="CASE STUDY · LENSKART"
      title="Pickup in store"
      line="Buy online, pick up in store: the first version cost conversions; the second shrank the choice to two lines on the cart. 23% of online orders, 2.5× fewer returns."
    />
  );
}
