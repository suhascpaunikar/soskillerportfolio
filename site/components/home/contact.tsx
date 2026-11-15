"use client";

import { Check, Copy } from "lucide-react";
import { useEffect, useState } from "react";

import { EMAIL } from "@/lib/career";
import { cn } from "@/lib/utils";

import { Btn, CONTAINER, T } from "./ui";

export function Contact() {
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!copied) return;
    const id = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(id);
  }, [copied]);

  return (
    <section id="contact" className={cn(CONTAINER, "scroll-mt-8")}>
      <div className="relative grid gap-12 overflow-hidden rounded-lg bg-paper px-5 pb-6 pl-8 pt-5 text-ink sm:p-10 lg:grid-cols-[1fr_428px] lg:gap-0 lg:p-0">
        <svg
          viewBox="0 0 640 380"
          preserveAspectRatio="xMinYMid slice"
          className="absolute inset-y-0 left-0 hidden h-full w-[640px] lg:block"
          fill="none"
          stroke="rgba(17,16,15,0.2)"
          strokeWidth="1.5"
          aria-hidden="true"
        >
          {[90, 170, 260, 360, 470, 590].map((rx) => (
            <ellipse key={rx} cx="300" cy="120" rx={rx} ry="330" />
          ))}
          {[60, 150, 240].map((ry) => (
            <ellipse key={ry} cx="300" cy="120" rx="590" ry={ry} />
          ))}
        </svg>

        <div className="relative lg:px-20 lg:py-[86px]">
          <div className="relative">
            <div
              aria-hidden="true"
              className="absolute inset-0 -translate-x-5 translate-y-5 rounded-lg bg-black/25"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 -translate-x-2.5 translate-y-2.5 rounded-lg bg-black/40"
            />
            <div className="relative rounded-lg bg-ink text-white">
              <div className="flex items-center justify-between border-b border-white/[0.16] px-3.5">
                <p className="m-0 -mb-px border-b border-white py-3.5 font-mono text-base lowercase leading-none">
                  brief
                </p>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard
                      ?.writeText(EMAIL)
                      .catch(() => undefined);
                    setCopied(true);
                  }}
                  aria-label="Copy my email address"
                  className="flex size-8 cursor-pointer items-center justify-center rounded-md border-0 bg-transparent text-white/65 outline-offset-2 hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-white/70"
                >
                  {copied ? (
                    <Check className="size-4" aria-hidden="true" />
                  ) : (
                    <Copy className="size-4" aria-hidden="true" />
                  )}
                </button>
              </div>
              <p className="m-0 px-3.5 py-6 font-mono text-[13px] lowercase leading-[1.5]">
                send the role, the team and the problem to:
                <br />
                <a
                  href={`mailto:${EMAIL}`}
                  className="break-all rounded text-flame no-underline outline-offset-2 hover:underline focus-visible:outline-2 focus-visible:outline-white/70"
                >
                  {EMAIL}
                </a>
                <br />
                and i will reply with a time to talk.
              </p>
              <p role="status" className="sr-only">
                {copied ? "Email address copied" : ""}
              </p>
            </div>
          </div>
        </div>

        <div className="relative flex flex-col items-start justify-between gap-10 lg:py-[86px] lg:pr-10">
          <div>
            <h2 className="m-0 text-[40px] font-normal leading-[0.95] tracking-[-0.01em] text-black lg:text-5xl lg:leading-[0.9]">
              Let’s make the next cut
            </h2>
            <p className={cn("m-0 mt-6 max-w-[26ch] text-black/65", T.body)}>
              Open to product design roles in commerce, retail and AI tools.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Btn href={`mailto:${EMAIL}`} tone="ink" arrow>
              Email me
            </Btn>
            <Btn href="/resume" tone="ghost-ink">
              Résumé
            </Btn>
          </div>
        </div>
      </div>
    </section>
  );
}
