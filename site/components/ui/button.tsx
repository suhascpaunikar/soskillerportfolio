import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

/** The edit suite's buttons: dark pills with a soft rim, a white pill for the main call to action, and a ghost. */
const base =
  "metal inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium no-underline outline-offset-4 focus-visible:outline-2 focus-visible:outline-playhead disabled:pointer-events-none disabled:opacity-40 aria-disabled:pointer-events-none aria-disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:shrink-0";

const variants = {
  default:
    "border border-white/[0.14] bg-[linear-gradient(180deg,#202020_0%,#000_100%)] text-[#ededf0] shadow-[0_0_0_1px_rgba(0,0,0,0.3),0_9px_9px_rgba(0,0,0,0.12),0_2px_5px_rgba(0,0,0,0.15)] [text-shadow:0_1px_2px_rgba(0,0,0,0.5)]",
  accent: "border border-white bg-[linear-gradient(180deg,#ffffff_0%,#dcdce2_100%)] font-semibold text-[#141416] shadow-[0_2px_8px_rgba(0,0,0,0.4)]",
  ghost: "border border-transparent text-muted-foreground hover:bg-white/[0.06] hover:text-foreground",
} as const;

const sizes = {
  default: "h-9 px-4 text-[13px]",
  sm: "h-8 px-3.5 text-xs",
  lg: "h-10 px-5 text-sm",
  icon: "size-9 p-0",
  "icon-sm": "size-7 p-0",
  "icon-lg": "size-10 p-0",
} as const;

export type ButtonVariant = keyof typeof variants;
export type ButtonSize = keyof typeof sizes;

/** The class list for a button-styled element (use it on a Link or an anchor). */
export function buttonVariants({ variant = "default", size = "default", className }: { variant?: ButtonVariant; size?: ButtonSize; className?: string } = {}) {
  return cn(base, variants[variant], sizes[size], className);
}

export function Button({
  variant,
  size,
  className,
  type = "button",
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant; size?: ButtonSize }) {
  return <button type={type} className={buttonVariants({ variant, size, className })} {...rest} />;
}
