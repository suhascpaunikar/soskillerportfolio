import type { Metadata } from "next";

import { HomeV7 } from "@/components/home-v7/home-v7";

export const metadata: Metadata = { title: "Home, version 7" };

export default function Page() {
  return <HomeV7 />;
}
