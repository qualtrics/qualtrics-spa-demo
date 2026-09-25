import { ref } from "vue";

/**
 * True once the deployment code has loaded.
 *
 * qsi_js_loaded is what Qualtrics fires when the API is ready. The footer
 * shows this too.
 */
export function useQsiLoaded() {
  const loaded = ref(Boolean(window.QSI?.API));

  if (!loaded.value) {
    window.addEventListener("qsi_js_loaded", () => (loaded.value = true), {
      once: true,
    });
  }

  return loaded;
}
