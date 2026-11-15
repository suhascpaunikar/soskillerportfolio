import type { Metadata } from "next";

import { EditSuite } from "@/components/edit-suite/edit-suite";

export const metadata: Metadata = { title: "The reel" };

/** The earlier home page: the edit suite, with the career laid out on a timeline. */
export default function Page() {
  return <EditSuite />;
}
