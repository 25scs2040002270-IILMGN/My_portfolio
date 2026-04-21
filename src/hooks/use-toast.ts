// use-toast.ts — Custom React hook for managing toast (pop-up notification) state.
// This implements a global state machine so toasts can be triggered from anywhere in the app.

// Import React for hooks (useState, useEffect)
import * as React from "react"

// Import the TypeScript types for Toast props and action elements
import type {
  ToastActionElement, // Type for the optional action button inside a toast
  ToastProps,         // All props accepted by the Toast component
} from "@/components/ui/toast"

// Maximum number of toasts visible at once (set to 1 to avoid clutter)
const TOAST_LIMIT = 1

// How long (in ms) before a dismissed toast is fully removed from memory
// Set to a very large number so toasts persist until explicitly dismissed
const TOAST_REMOVE_DELAY = 1000000

// Extend ToastProps to include the fields we manage internally
type ToasterToast = ToastProps & {
  id: string                      // Unique identifier for each toast
  title?: React.ReactNode         // Optional bold headline text
  description?: React.ReactNode   // Optional secondary descriptive text
  action?: ToastActionElement     // Optional action button (e.g., "Undo")
}

// Define all possible action types for the state reducer
// "as const" makes the values readonly string literals, not just strings
const actionTypes = {
  ADD_TOAST: "ADD_TOAST",       // Add a new toast to the list
  UPDATE_TOAST: "UPDATE_TOAST", // Update an existing toast by ID
  DISMISS_TOAST: "DISMISS_TOAST", // Start the dismiss animation
  REMOVE_TOAST: "REMOVE_TOAST",   // Fully remove a toast from memory
} as const

// Counter to generate unique IDs for each toast
let count = 0

// genId creates an ever-incrementing unique ID string for each new toast
function genId() {
  // Increment the counter, wrapping at MAX_SAFE_INTEGER to avoid overflow
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString() // Return as string since IDs are strings
}

// Type alias for the actionTypes object (for use in Action type below)
type ActionType = typeof actionTypes

// Union type — an Action can be one of four shapes depending on its "type" field
type Action =
  | {
      type: ActionType["ADD_TOAST"]  // Payload: the full toast object
      toast: ToasterToast
    }
  | {
      type: ActionType["UPDATE_TOAST"] // Payload: partial toast to merge by ID
      toast: Partial<ToasterToast>
    }
  | {
      type: ActionType["DISMISS_TOAST"] // Payload: optional ID (undefined = dismiss all)
      toastId?: ToasterToast["id"]
    }
  | {
      type: ActionType["REMOVE_TOAST"]  // Payload: optional ID (undefined = remove all)
      toastId?: ToasterToast["id"]
    }

// Shape of the global toast state — just an array of active toasts
interface State {
  toasts: ToasterToast[]
}

// Map of toastId → setTimeout handle
// Used to track removal timers so we can cancel them if needed
const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

// Schedule a toast to be removed from memory after TOAST_REMOVE_DELAY ms
const addToRemoveQueue = (toastId: string) => {
  // If there's already a removal timer for this toast, don't add another
  if (toastTimeouts.has(toastId)) {
    return
  }

  // Set a timer to dispatch REMOVE_TOAST after the delay
  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId) // Clean up the map entry
    dispatch({
      type: "REMOVE_TOAST",
      toastId: toastId, // Remove this specific toast from memory
    })
  }, TOAST_REMOVE_DELAY)

  // Store the timeout handle so we can cancel it if needed
  toastTimeouts.set(toastId, timeout)
}

// Pure reducer function — takes current state + an action and returns the new state
// Pure means no side effects — the same inputs always produce the same output
export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    // ADD_TOAST: prepend the new toast, then trim the list to TOAST_LIMIT
    case "ADD_TOAST":
      return {
        ...state, // Keep all other state properties
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }

    // UPDATE_TOAST: find the toast by ID and merge in the updated fields
    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      }

    // DISMISS_TOAST: mark toast(es) as closed and schedule removal
    case "DISMISS_TOAST": {
      const { toastId } = action

      // Side effect: schedule the toast for removal after the delay
      if (toastId) {
        addToRemoveQueue(toastId) // Dismiss one specific toast
      } else {
        // No ID provided — dismiss all toasts
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id)
        })
      }

      // Set open: false on the toast(es) to trigger the exit animation
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false, // Closing animation is triggered by this flag
              }
            : t // Leave other toasts unchanged
        ),
      }
    }

    // REMOVE_TOAST: fully delete the toast from memory (after animation ends)
    case "REMOVE_TOAST":
      if (action.toastId === undefined) {
        // No ID = remove all toasts
        return {
          ...state,
          toasts: [],
        }
      }
      // Remove only the toast matching the given ID
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      }
  }
}

// Array of listener functions — each mounted component using useToast registers here
// When state changes, all listeners are called so every consumer re-renders
const listeners: Array<(state: State) => void> = []

// The single source of truth for toast state — lives outside React for global access
let memoryState: State = { toasts: [] }

// dispatch sends an action through the reducer, updates memoryState, and notifies listeners
function dispatch(action: Action) {
  memoryState = reducer(memoryState, action) // Calculate the new state
  listeners.forEach((listener) => {
    listener(memoryState) // Notify every subscribed component to re-render
  })
}

// Omit the internal "id" field from ToasterToast — callers don't supply IDs
type Toast = Omit<ToasterToast, "id">

// toast() is the main API for showing a new notification from anywhere in the app
// Example: toast({ title: "Saved!", description: "Your changes were saved." })
function toast({ ...props }: Toast) {
  const id = genId() // Generate a unique ID for this toast

  // update() lets you modify this toast after it's been shown
  const update = (props: ToasterToast) =>
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...props, id }, // Merge updates into the existing toast
    })

  // dismiss() triggers the closing animation for this specific toast
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id })

  // Add the new toast to the global state immediately
  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,    // Title, description, variant, action, etc. from caller
      id,          // Unique ID we generated
      open: true,  // Start in the open (visible) state
      // When the toast's open state changes to false, trigger the dismiss flow
      onOpenChange: (open) => {
        if (!open) dismiss()
      },
    },
  })

  // Return control handles so callers can programmatically update or dismiss the toast
  return {
    id: id,
    dismiss,
    update,
  }
}

// useToast is the React hook that components use to read toast state and show toasts
function useToast() {
  // Local React state that mirrors the global memoryState
  const [state, setState] = React.useState<State>(memoryState)

  // Subscribe to global state updates when the component mounts
  // Unsubscribe when the component unmounts to avoid memory leaks
  React.useEffect(() => {
    listeners.push(setState) // Register this component's setState as a listener
    return () => {
      // On unmount: find and remove this component's listener from the array
      const index = listeners.indexOf(setState)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [state])

  // Return the current state plus the toast and dismiss functions
  return {
    ...state,   // Spreads: { toasts: ToasterToast[] }
    toast,      // Function to show a new toast
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
  }
}

// Export the hook and the toast function for use in components
export { useToast, toast }
