import type { Metadata } from "next";

import { HomeV4 } from "@/components/home-v4/home-v4";

export const metadata: Metadata = { title: "Home, version 4" };

export default function Page() {
  return <HomeV4 />;
}
