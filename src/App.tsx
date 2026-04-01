import { Helmet, HelmetProvider } from "react-helmet-async";
import { RouterProvider } from "react-router";

import { Toaster } from "@/components/ui/sonner";

import { ThemeProvider } from "./components/theme/theme-provider";
import "./index.css";
import { router } from "./routes";

export function App() {
  return (
    <>
      <HelmetProvider>
        <ThemeProvider storageKey="loanX-theme" defaultTheme="system">
          <Helmet titleTemplate="%s | VeroFlux " />
          <Toaster richColors closeButton />
          <RouterProvider router={router} />
        </ThemeProvider>
      </HelmetProvider>
    </>
  );
}
