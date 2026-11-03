/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/*
 * Ported from the Diffusion Studio editor's button
 * (https://github.com/diffusionstudio/editor, apps/web/src/components/ui/button.tsx),
 * itself based on shadcn-solid. Same variants and colours, rewritten for React.
 * The "lg" size is added here for the site's larger calls to action.
 */

import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

const base = [
  "inline-flex items-center justify-center gap-1 whitespace-nowrap rounded-md font-[450] text-xs transition-all shrink-0 outline-none cursor-pointer no-underline",
  "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background",
  "disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50",
  "[&_svg]:pointer-events-none [&_svg]:shrink-0",
].join(" ");

const variants = {
  default: "bg-primary text-primary-foreground hover:bg-primary-hover active:bg-primary-pressing",
  secondary: "bg-secondary text-foreground hover:bg-secondary-hover active:bg-secondary-pressing",
  on: "bg-tertiary text-tertiary-foreground hover:bg-tertiary-hover active:bg-tertiary-pressing",
  ghost: "text-foreground hover:bg-accent active:bg-muted",
  link: "px-0 bg-transparent text-muted-foreground hover:text-foreground active:text-foreground",
  outline: "bg-transparent border border-border-input text-foreground hover:bg-input",
} as const;

const sizes = {
  default: "h-7 px-2",
  small: "h-5 px-1 text-xxs font-normal rounded",
  lg: "h-9 px-3.5 text-[13px] gap-1.5",
  icon: "w-6 h-7 p-0",
  "icon-square": "size-7 p-0",
  "icon-lg": "size-9 p-0",
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
  return <button type={type} data-slot="button" className={buttonVariants({ variant, size, className })} {...rest} />;
}
