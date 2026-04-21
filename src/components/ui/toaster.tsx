// toaster.tsx — The Toaster component that renders all active toast notifications.
// Toasts are non-blocking pop-up messages shown in a corner of the screen.

// useToast hook provides the list of currently active toasts and methods to control them
import { useToast } from "@/hooks/use-toast"

// Import all building blocks of the Toast UI from the toast component file
import {
  Toast,            // The individual toast card container
  ToastClose,       // The "X" close button on each toast
  ToastDescription, // Optional secondary text below the title
  ToastProvider,    // Root provider that manages toast portal and animations
  ToastTitle,       // Bold headline text of the toast
  ToastViewport,    // The fixed-position container in the corner of the screen
} from "@/components/ui/toast"

// Toaster renders all currently active toasts in the viewport
// It should be placed once, near the root of the app (in App.tsx)
export function Toaster() {
  // Get the live list of toasts from the global toast state manager
  const { toasts } = useToast()

  return (
    // ToastProvider manages the animation state and portal rendering for all toasts
    <ToastProvider>
      {/* Loop over every active toast and render it */}
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          // Each Toast card — spread all props like variant, duration, callbacks
          <Toast key={id} {...props}>
            {/* Grid layout to stack title above description */}
            <div className="grid gap-1">
              {/* Only render the title element if a title was provided */}
              {title && <ToastTitle>{title}</ToastTitle>}

              {/* Only render the description element if a description was provided */}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>

            {/* Optional action button (e.g., "Undo", "Retry") passed by the caller */}
            {action}

            {/* The X button to manually dismiss this toast */}
            <ToastClose />
          </Toast>
        )
      })}

      {/* ToastViewport is the fixed corner container that holds all toasts on screen */}
      <ToastViewport />
    </ToastProvider>
  )
}
