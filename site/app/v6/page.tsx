import type { Metadata } from "next";

import { HomeV6 } from "@/components/home-v6/home-v6";

export const metadata: Metadata = { title: "Home, version 6" };

export default function Page() {
  return <HomeV6 />;
}
