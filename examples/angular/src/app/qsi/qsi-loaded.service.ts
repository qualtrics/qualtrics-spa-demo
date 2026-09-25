import { Injectable, signal } from '@angular/core';

/**
 * True once the deployment code has loaded.
 *
 * qsi_js_loaded is what Qualtrics fires when the API is ready. The footer
 * shows this too.
 */
@Injectable({ providedIn: 'root' })
export class QsiLoadedService {
  readonly loaded = signal(Boolean(window.QSI?.API));

  constructor() {
    if (this.loaded()) return;
    window.addEventListener('qsi_js_loaded', () => this.loaded.set(true), { once: true });
  }
}
