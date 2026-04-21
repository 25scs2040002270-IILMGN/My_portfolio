// tooltip.tsx — A reusable Tooltip component built on Radix UI primitives.
// Tooltips are small pop-up labels that appear when the user hovers over an element.

"use client" // Next.js directive (harmless in Vite — kept for shadcn compatibility)

// React is needed for JSX and forwardRef
import * as React from "react"

// Import all Radix UI Tooltip primitives under the alias "TooltipPrimitive"
// Radix handles all the accessibility logic (ARIA, keyboard navigation, focus)
import * as TooltipPrimitive from "@radix-ui/react-tooltip"

// cn utility merges Tailwind classes cleanly (handles conflicts & conditionals)
import { cn } from "@/lib/utils"

// TooltipProvider must wrap any part of the app that uses tooltips
// It manages shared tooltip state (open delay, close behavior)
const TooltipProvider = TooltipPrimitive.Provider

// Tooltip is the root container for a single tooltip — wraps Trigger + Content
const Tooltip = TooltipPrimitive.Root

// TooltipTrigger is the element that activates the tooltip on hover/focus
const TooltipTrigger = TooltipPrimitive.Trigger

// TooltipContent is the styled pop-up label shown on hover
// React.forwardRef passes the ref to the underlying DOM node for direct access
const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,         // The DOM element type
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content> // Props (minus ref)
>(({ className, sideOffset = 4, ...props }, ref) => (
  // TooltipPrimitive.Portal renders the tooltip outside the normal DOM tree
  // This prevents the tooltip from being clipped by overflow:hidden parents
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content
      ref={ref}                   // Forward the ref to the actual content element
      sideOffset={sideOffset}     // Gap between the trigger and the tooltip (4px default)
      className={cn(
        // Base styles for the tooltip bubble
        "z-50 overflow-hidden rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground",
        // Entry animation — fade in and scale up from 95%
        "animate-in fade-in-0 zoom-in-95",
        // Exit animation — fade out and scale down when closing
        "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
        // Slide direction depending on which side the tooltip appears
        "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2",
        "data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        // CSS transform origin set by Radix for smooth scaling from the right point
        "origin-[--radix-tooltip-content-transform-origin]",
        className // Allow callers to add extra classes
      )}
      {...props} // Pass through all other props (children, side, align, etc.)
    />
  </TooltipPrimitive.Portal>
))
// Set a display name for better React DevTools debugging
TooltipContent.displayName = TooltipPrimitive.Content.displayName

// Export the four building blocks so they can be used together in other components
export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
