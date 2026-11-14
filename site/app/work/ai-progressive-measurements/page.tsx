import type { Metadata } from "next";

import { CaseStudyPage } from "@/components/case-study/case-study";
import { measurements } from "@/lib/case-studies";

export const metadata: Metadata = {
  title: measurements.meta.title,
  description: measurements.meta.description,
  openGraph: { type: "article", title: measurements.meta.title, description: measurements.meta.description },
};

export default function Page() {
  return <CaseStudyPage study={measurements} />;
}
