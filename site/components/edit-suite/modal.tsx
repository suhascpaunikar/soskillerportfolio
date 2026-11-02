"use client";

import { useEffect, useRef, type ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * A native <dialog>: the browser handles the focus trap, Esc and the inert page behind it.
 * `center` is a centred dialog; `sheet` slides up from the bottom on phones.
 */
export function Modal({
  open,
  onClose,
  label,
  variant = "center",
  className,
  children,
}: {
  open: boolean;
  onClose: () => void;
  label: string;
  variant?: "center" | "sheet";
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-label={label}
      onClose={onClose}
      onClick={(e) => {
        // A click on the dialog box itself (not its content) is a click on the backdrop.
        if (e.target === e.currentTarget) onClose();
      }}
      className={cn(
        "bg-transparent p-0 text-foreground backdrop:bg-[rgb(5_5_7/0.72)]",
        variant === "center" ? "m-auto w-[calc(100%-32px)] max-w-[520px]" : "mx-0 mb-0 mt-auto w-full max-w-none",
        className,
      )}
    >
      {children}
    </dialog>
  );
}
