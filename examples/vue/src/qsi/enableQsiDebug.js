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
export function enableQsiDebug() {
  if (!window.QSI?.API) return false;

  window.QSI.API.unload();
  window.QSI.isDebug = true;
  window.QSI.API.load().then(window.QSI.API.run, err =>
    console.warn("[qsi] load failed", err)
  );

  return true;
}

/**
 * Turns debug back off.
 *
 * isDebug sticks around, so without this every later load() turns debug on
 * again and the window reopens on each route change.
 */
export function disableQsiDebug() {
  if (window.QSI) window.QSI.isDebug = false;
}
