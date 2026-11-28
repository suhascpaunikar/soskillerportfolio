import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Silicon Garden",
  description: "Grow and explore a 3D particle tree rooted in a silicon wafer.",
};

const basePath = process.env.PAGES_BASE_PATH ?? "";

export default function SiliconGardenPage() {
  return (
    <main className="flex h-dvh flex-col bg-[#0b0e0c] text-white">
      <div className="border-b border-white/15 px-5 py-3">
        <Link href="/" className="text-sm text-[#c8f58a] underline-offset-4 hover:underline">
          Back to portfolio
        </Link>
      </div>
      <iframe
        title="Silicon Garden interactive experiment"
        src={`${basePath}/experiments/silicon-garden/index.html`}
        allow="clipboard-write"
        className="min-h-0 w-full flex-1 border-0"
      />
    </main>
  );
}
