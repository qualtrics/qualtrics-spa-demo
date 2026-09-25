import { useEffect, useState } from "react";
import { Routes, Route, NavLink, useLocation } from "react-router-dom";

import Home from "./pages/Home.jsx";
import Products from "./pages/Products.jsx";
import Checkout from "./pages/Checkout.jsx";

import { useQsiRoute } from "./qsi/useQsiRoute.js";
import { useQsiLoaded } from "./qsi/useQsiLoaded.js";
import { useDocumentTitle } from "./useDocumentTitle.js";
import { enableQsiDebug, disableQsiDebug } from "./qsi/enableQsiDebug.js";

export default function App() {
  const { pathname, search } = useLocation();

  const [debug, setDebug] = useState(false);

  // Turns debug off when you navigate, so the window doesn't reopen on every
  // page. Sits above useQsiRoute on purpose: effects run in the order they're
  // declared, and this has to happen before the re-run calls load().
  useEffect(() => {
    disableQsiDebug();
    setDebug(false);
  }, [pathname, search]);

  // The whole Qualtrics integration. The count is only for the footer.
  const runs = useQsiRoute();

  // Both of these are for the demo, not the integration.
  const loaded = useQsiLoaded();
  useDocumentTitle();

  return (
    <>
      <header>
        <span className="brand">
          <img src="/qualtrics-logo.svg" alt="Qualtrics" />
          <span>SPA demo · React</span>
        </span>
        <nav>
          <NavLink to="/" end>
            Home
          </NavLink>
          <NavLink to="/products">Products</NavLink>
          <NavLink to="/checkout">Checkout</NavLink>
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/checkout" element={<Checkout />} />
        </Routes>
      </main>

      <footer>
        <code>{pathname + search}</code> · 0 page reloads · {runs} re-{runs === 1 ? "run" : "runs"} ·
        deployment code{" "}
        <span className={loaded ? "ok" : "missing"}>{loaded ? "loaded" : "not detected"}</span>
        {loaded && " · "}
        {loaded &&
          (debug ? (
            <span className="ok">debug on</span>
          ) : (
            <button onClick={() => setDebug(enableQsiDebug())}>open debug window</button>
          ))}
      </footer>
    </>
  );
}
