/**
 * Opens the Qualtrics debug window, which lists an intercept's conditions and
 * whether each one passed. Stays on until you reload.
 *
 * Works the same in the console on any site, not just this one:
 *
 *   QSI.API.unload();
 *   QSI.isDebug = true;
 *   QSI.API.load();
 *   QSI.API.run();
 */
export function enableQsiDebug(): boolean {
  const api = window.QSI?.API;
  if (!api) return false;

  api.unload();
  window.QSI!.isDebug = true;
  api.load().then(
    () => api.run(),
    (err) => console.warn('[qsi] load failed', err),
  );

  return true;
}

/**
 * Turns debug back off.
 *
 * isDebug sticks around, so without this every later load() turns debug on
 * again and the window reopens on each route change.
 */
export function disableQsiDebug(): void {
  if (window.QSI) window.QSI.isDebug = false;
}
