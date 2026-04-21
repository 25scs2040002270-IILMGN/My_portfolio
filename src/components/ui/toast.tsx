// toast.tsx — The Toast UI component built on Radix UI primitives.
// A toast is a small non-blocking pop-up notification that appears briefly on screen.

// React is needed for forwardRef and JSX
import * as React from "react"

// Radix UI provides the headless (unstyled) toast logic:
// positioning, animation state, swipe to dismiss, ARIA roles, keyboard handling
import * as ToastPrimitives from "@radix-ui/react-toast"

// cva = "class variance authority" — creates type-safe, variant-based class lists
// VariantProps extracts TypeScript types from a cva() definition
import { cva, type VariantProps } from "class-variance-authority"

// X is the close/dismiss icon from lucide-react
import { X } from "lucide-react"

// cn merges Tailwind classes without conflicts
import { cn } from "@/lib/utils"

// ToastProvider is the root context provider — must wrap all toast components
// It manages the viewport, animation timings, and swipe behavior
const ToastProvider = ToastPrimitives.Provider

// ToastViewport is the fixed-position corner container on screen that holds all toasts
// forwardRef lets parent components access the DOM node directly if needed
const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      // Fixed position at top on mobile, bottom-right on desktop
      "fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4",
      "sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]",
      className // Allow callers to add extra classes
    )}
    {...props} // Pass through all Radix viewport props
  />
))
ToastViewport.displayName = ToastPrimitives.Viewport.displayName

// toastVariants defines the visual styles for each toast "variant"
// cva() generates Tailwind class strings based on which variant is selected
const toastVariants = cva(
  // Base styles applied to every toast regardless of variant
  [
    "group pointer-events-auto relative flex w-full items-center justify-between",
    "space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all",
    // Swipe gesture support — moves toast as user swipes, then removes it
    "data-[swipe=cancel]:translate-x-0",
    "data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)]",
    "data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)]",
    "data-[swipe=move]:transition-none",
    // Entry and exit animations driven by Radix data attributes
    "data-[state=open]:animate-in data-[state=closed]:animate-out",
    "data-[swipe=end]:animate-out",
    "data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full",
    "data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full",
  ].join(" "),
  {
    variants: {
      variant: {
        // Default: neutral dark theme — uses background and foreground colors
        default: "border bg-background text-foreground",
        // Destructive: red theme for errors or warnings
        destructive:
          "destructive group border-destructive bg-destructive text-destructive-foreground",
      },
    },
    // If no variant is specified, use "default"
    defaultVariants: {
      variant: "default",
    },
  }
)

// Toast is the main card container for a single notification
// It forwards its ref and applies the correct variant styles
const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> &
    VariantProps<typeof toastVariants> // Add "variant" prop to the accepted props
>(({ className, variant, ...props }, ref) => {
  return (
    <ToastPrimitives.Root
      ref={ref}
      className={cn(toastVariants({ variant }), className)} // Merge variant + custom classes
      {...props} // Pass through children, open state, duration, callbacks, etc.
    />
  )
})
Toast.displayName = ToastPrimitives.Root.displayName

// ToastAction is an optional interactive button inside the toast (e.g., "Undo")
const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      // Base button styles
      "inline-flex h-8 shrink-0 items-center justify-center rounded-md border",
      "bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors",
      // Focus styles for keyboard accessibility
      "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
      // Disabled state
      "disabled:pointer-events-none disabled:opacity-50",
      // Extra styles when inside a destructive toast (peer group selector)
      "group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30",
      "group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground",
      "group-[.destructive]:focus:ring-destructive",
      className
    )}
    {...props}
  />
))
ToastAction.displayName = ToastPrimitives.Action.displayName

// ToastClose is the X button that dismisses the toast when clicked
const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      // Positioned at the top-right corner of the toast card
      "absolute right-2 top-2 rounded-md p-1",
      // Invisible by default, revealed on hover or focus
      "text-foreground/50 opacity-0 transition-opacity",
      "hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2",
      // Revealed when the whole toast group is hovered
      "group-hover:opacity-100",
      // Red color override inside destructive toasts
      "group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50",
      "group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600",
      className
    )}
    toast-close="" // Radix uses this attribute to identify the close button
    {...props}
  >
    {/* X icon from lucide-react */}
    <X className="h-4 w-4" />
  </ToastPrimitives.Close>
))
ToastClose.displayName = ToastPrimitives.Close.displayName

// ToastTitle is the bold headline text of the notification
const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    className={cn("text-sm font-semibold", className)} // Small bold text
    {...props}
  />
))
ToastTitle.displayName = ToastPrimitives.Title.displayName

// ToastDescription is the optional secondary text below the title
const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className={cn("text-sm opacity-90", className)} // Slightly muted secondary text
    {...props}
  />
))
ToastDescription.displayName = ToastPrimitives.Description.displayName

// Export TypeScript types for the Toast and ToastAction props
// These are used by use-toast.ts to type the toast state
type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>
type ToastActionElement = React.ReactElement<typeof ToastAction>

// Export all components and types for use in toaster.tsx and elsewhere
export {
  type ToastProps,
  type ToastActionElement,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
}
