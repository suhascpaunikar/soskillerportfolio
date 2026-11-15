"use client";

import { Check, Copy } from "lucide-react";
import { useEffect, useState } from "react";

import { EMAIL } from "@/lib/career";

/** Copies the email address and says so for two seconds. */
export function CopyEmail({ className }: { className?: string }) {
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!copied) return;
    const id = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(id);
  }, [copied]);

  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard?.writeText(EMAIL).catch(() => undefined);
        setCopied(true);
      }}
      className={className}
    >
      {copied ? <Check className="size-3.5" aria-hidden="true" /> : <Copy className="size-3.5" aria-hidden="true" />}
      <span aria-live="polite">{copied ? "Copied" : "Copy address"}</span>
    </button>
  );
}
