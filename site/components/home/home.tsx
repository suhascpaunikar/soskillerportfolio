import { Backstory } from "./backstory";
import { Brands } from "./brands";
import { Contact } from "./contact";
import { Footer } from "./footer";
import { Header } from "./header";
import { Hero } from "./hero";
import { Lab } from "./lab";
import { Principles } from "./principles";
import { Proof } from "./proof";
import { Work } from "./work";

/**
 * The home page (v2): one long page on a warm near-black, set in Figtree with JetBrains Mono labels.
 * It lives at /v2; the edit suite stays at / and a third take is at /v3.
 */
export function Home() {
  return (
    <div className="v2 min-h-dvh bg-ink font-figtree text-white">
      <a href="#main" className="sr-only rounded-md bg-paper px-3 py-2 text-ink focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50">
        Skip to content
      </a>
      <Header />
      <main id="main">
        <Hero />
        <Brands />
        <Work />
        <Backstory />
        <Proof />
        <Lab />
        <Principles />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
