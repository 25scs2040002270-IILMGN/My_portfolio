// utils.ts — Shared utility functions used across UI components.

// clsx combines multiple class names and handles conditionals cleanly
// Example: clsx("foo", isActive && "bar") → "foo bar" (if isActive is true)
import { clsx, type ClassValue } from "clsx";

// twMerge intelligently merges Tailwind CSS classes, removing conflicts
// Example: twMerge("p-4 p-2") → "p-2" (last one wins, no duplicate padding)
import { twMerge } from "tailwind-merge";

// cn() is a helper function used throughout shadcn/ui components
// It combines clsx (for conditional classes) with twMerge (for Tailwind deduplication)
// Usage: cn("base-class", condition && "conditional-class", className)
export function cn(...inputs: ClassValue[]) {
  // First apply clsx to handle arrays, objects, and conditionals
  // Then pass the result through twMerge to deduplicate Tailwind utilities
  return twMerge(clsx(inputs));
}
