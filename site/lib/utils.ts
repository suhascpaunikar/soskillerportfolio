import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/** tailwind-merge, told about the custom `text-xxs` size in globals.css so it isn't mistaken for a colour. */
const twMerge = extendTailwindMerge({
  extend: { theme: { text: ["xxs"] } },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
