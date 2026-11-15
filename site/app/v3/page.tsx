import type { Metadata } from "next";

import { HomeV3 } from "@/components/home-v3/home-v3";

export const metadata: Metadata = { title: "Home, version 3" };

export default function Page() {
  return <HomeV3 />;
}
