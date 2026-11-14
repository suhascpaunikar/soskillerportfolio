import type { Metadata } from "next";

import { CaseStudyPage } from "@/components/case-study/case-study";
import { pickup } from "@/lib/case-studies";

export const metadata: Metadata = {
  title: pickup.meta.title,
  description: pickup.meta.description,
  openGraph: { type: "article", title: pickup.meta.title, description: pickup.meta.description },
};

export default function Page() {
  return <CaseStudyPage study={pickup} />;
}
