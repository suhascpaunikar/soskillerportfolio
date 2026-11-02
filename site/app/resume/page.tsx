import type { Metadata } from "next";

import { ComingSoon } from "@/components/coming-soon";

export const metadata: Metadata = { title: "Résumé" };

export default function Page() {
  return (
    <ComingSoon
      eyebrow="RÉSUMÉ"
      title="Résumé"
      line="Six years across OML, Ting and Lenskart, readable here without downloading a PDF."
    />
  );
}
