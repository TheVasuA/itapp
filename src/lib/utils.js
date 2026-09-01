import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge conditional class names and resolve conflicting Tailwind utilities.
 * Combines `clsx` (conditional join) with `tailwind-merge` (dedupe/override).
 *
 * @param {...import("clsx").ClassValue} inputs - class values to combine
 * @returns {string} the merged className string
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
