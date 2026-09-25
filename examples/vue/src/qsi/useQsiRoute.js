import { ref, watch } from "vue";
import { useRoute } from "vue-router";

import { useQsiLoaded } from "./useQsiLoaded.js";

/**
 * Re-runs Website Feedback whenever the route changes.
 * Call it once, from App.vue.
 *
 * Skip this if the project has "Re-evaluate intercept logic when the URL
 * changes" turned on. Qualtrics handles it then, and doing both means
 * everything fires twice.
 */
export function useQsiRoute() {
  const route = useRoute();

  // Waits for qsi_js_loaded. Navigate while the deployment code is still
  // loading and it gets picked up after, instead of being dropped.
  const loaded = useQsiLoaded();

  // Just for the counter in the footer, not part of the integration.
  const runs = ref(0);

  // Starts at the current URL, since index.html already ran for it. loaded
  // turning true trips the watcher on its own, and this stops that counting as
  // a route change.
  let lastRun = route.fullPath;

  // fullPath has the query string in it, so /products and /products?promo=x
  // count as different URLs.
  //
  // watch only fires on changes, never for the value it starts on, so no
  // first-navigation guard here. React and Angular both need one.
  //
  // flush: "post" waits for Vue to update the DOM. Without it the callback runs
  // first, the page is still showing the view you just left, and an intercept
  // looking for something on the new one won't find it.
  watch([() => route.fullPath, loaded], ([url, isLoaded]) => {
    if (!isLoaded) return; // no deployment code on the page, or still loading
    if (lastRun === url) return;
    lastRun = url;

    warnIfProjectAlreadyHandlesThis();

    // unload() first, or load() fails and run() never happens.
    window.QSI.API.unload();

    // .then(ok, fail), not .catch(). What load() returns has no .catch().
    window.QSI.API.load().then(window.QSI.API.run, err =>
      console.warn("[qsi] load failed", err)
    );

    console.log("[qsi] re-ran for", url);
    runs.value += 1;
  }, { flush: "post" });

  return runs;
}

let checkedSetting = false;

/**
 * Warns once if the project already re-evaluates on URL change, because then
 * this is doing the same work twice.
 */
function warnIfProjectAlreadyHandlesThis() {
  if (checkedSetting) return;
  if (!window.QSI?.Orchestrator) return; // not loaded yet, look again next time
  checkedSetting = true;

  try {
    const auto =
      window.QSI.Orchestrator.csTargetingParams?.targetingResponse?.RequestData
        ?.reevaluateInterceptOnUrlChange;

    if (auto) {
      console.warn(
        '[qsi] This project has "Re-evaluate intercept logic when the URL changes" turned on, ' +
          "so Qualtrics is already re-running on route changes. This composable is doing it a " +
          "second time. Turn off one or the other."
      );
    }
  } catch {
    // ignore
  }
}
