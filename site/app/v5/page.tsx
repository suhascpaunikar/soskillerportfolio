import type { Metadata } from "next";

import { HomeV5 } from "@/components/home-v5/home-v5";

export const metadata: Metadata = { title: "Home, version 5" };

export default function Page() {
  return <HomeV5 />;
}
