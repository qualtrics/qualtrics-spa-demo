import { useEffect, useState } from "react";

/**
 * True once the deployment code has loaded.
 *
 * qsi_js_loaded is what Qualtrics fires when the API is ready. The footer
 * shows this too.
 */
export function useQsiLoaded() {
  const [loaded, setLoaded] = useState(() => Boolean(window.QSI?.API));

  useEffect(() => {
    if (loaded) return;

    const onReady = () => setLoaded(true);
    window.addEventListener("qsi_js_loaded", onReady, { once: true });
    return () => window.removeEventListener("qsi_js_loaded", onReady);
  }, [loaded]);

  return loaded;
}
