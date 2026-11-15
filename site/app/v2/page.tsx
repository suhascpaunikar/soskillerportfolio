import type { Metadata } from "next";

import { Home } from "@/components/home/home";

export const metadata: Metadata = { title: "Home, version 2" };

export default function Page() {
  return <Home />;
}
