// main.tsx — The entry point of the React application.
// This is the first file that runs when the app starts in the browser.

// Import createRoot from React DOM — this is the modern React 18 way to mount the app
import { createRoot } from "react-dom/client";

// Import the root App component that wraps everything
import App from "./App";

// Import the global CSS stylesheet (dark theme, Tailwind, custom utilities)
import "./index.css";

// Find the <div id="root"> element in index.html
// The "!" tells TypeScript this element definitely exists (non-null assertion)
// Then call .render() to inject the entire React app into that div
createRoot(document.getElementById("root")!).render(<App />);
