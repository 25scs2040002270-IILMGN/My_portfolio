// App.tsx — The root component of the application.
// It sets up global providers that wrap the entire app.

// QueryClient manages all data fetching, caching, and state for API calls
// QueryClientProvider makes the client available to every component in the tree
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Toaster is the notification system — shows pop-up messages at the corner of the screen
import { Toaster } from "@/components/ui/toaster";

// TooltipProvider enables hover tooltips anywhere in the app
import { TooltipProvider } from "@/components/ui/tooltip";

// The main portfolio page component that contains all sections
import PortfolioApp from "@/components/PortfolioApp";

// Create a single QueryClient instance for the whole app
// This manages caching and background refetching of any API data
const queryClient = new QueryClient();

// App is the top-level component rendered in main.tsx
function App() {
  return (
    // QueryClientProvider wraps everything so all child components can fetch data
    <QueryClientProvider client={queryClient}>
      {/* TooltipProvider enables tooltip functionality globally */}
      <TooltipProvider>
        {/* Render the full single-page portfolio */}
        <PortfolioApp />

        {/* Toaster renders any toast notifications in the corner of the screen */}
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

// Export App as the default export so main.tsx can import and render it
export default App;
