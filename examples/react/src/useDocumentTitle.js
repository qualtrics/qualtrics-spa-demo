import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const titles = {
  "/": "Home",
  "/products": "Products",
  "/checkout": "Checkout",
};

/**
 * Keeps the tab title in step with the route.
 *
 * Nothing to do with Qualtrics, but the same problem. An SPA never reloads, so
 * the title stays on whatever the first page said unless you set it.
 */
export function useDocumentTitle() {
  const { pathname } = useLocation();

  useEffect(() => {
    const name = titles[pathname] ?? "Not found";
    document.title = `${name} · Qualtrics SPA demo`;
  }, [pathname]);
}
