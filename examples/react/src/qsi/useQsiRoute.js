import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

import { useQsiLoaded } from "./useQsiLoaded.js";

/**
 * Re-runs Website Feedback whenever the route changes.
 * Call it once, above your <Routes>.
 *
 * Skip this if the project has "Re-evaluate intercept logic when the URL
 * changes" turned on. Qualtrics handles it then, and doing both means
 * everything fires twice.
 */
export function useQsiRoute() {
  const { pathname, search } = useLocation();

  // search is in here so /products and /products?promo=x count as different
  // URLs.
  const url = pathname + search;

  // Waits for qsi_js_loaded. Navigate while the deployment code is still
  // loading and it gets picked up after, instead of being dropped.
  const loaded = useQsiLoaded();

  // Just for the counter in the footer, not part of the integration.
  const [runs, setRuns] = useState(0);

  // Starts at the current URL, since index.html already ran for it. A ref and
  // not state, or StrictMode's double render in dev slips a second run
  // through.
  const lastRun = useRef(url);

  useEffect(() => {
    if (!loaded) return; // no deployment code on the page, or still loading
    if (lastRun.current === url) return;
    lastRun.current = url;

    // unload() first, or load() fails and run() never happens.
    window.QSI.API.unload();

    // .then(ok, fail), not .catch(). What load() returns has no .catch().
    window.QSI.API.load().then(window.QSI.API.run, err =>
      console.warn("[qsi] load failed", err)
    );

    console.log("[qsi] re-ran for", url);
    setRuns(n => n + 1);
  }, [url, loaded]);

  useWarnIfProjectAlreadyHandlesThis(url);

  return runs;
}

/**
 * Warns once if the project already re-evaluates on URL change, because then
 * this is doing the same work twice.
 */
function useWarnIfProjectAlreadyHandlesThis(url) {
  const checked = useRef(false);

  useEffect(() => {
    if (checked.current) return;
    if (!window.QSI?.Orchestrator) return; // not loaded yet, look again next time
    checked.current = true;

    try {
      const auto =
        window.QSI.Orchestrator.csTargetingParams?.targetingResponse?.RequestData
          ?.reevaluateInterceptOnUrlChange;

      if (auto) {
        console.warn(
          '[qsi] This project has "Re-evaluate intercept logic when the URL changes" turned on, ' +
            "so Qualtrics is already re-running on route changes. This hook is doing it a second " +
            "time. Turn off one or the other."
        );
      }
    } catch {
      // ignore
    }
  }, [url]);
}
