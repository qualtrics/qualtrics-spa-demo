import { Injectable, inject, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

declare global {
  interface Window {
    QSI?: {
      API?: {
        load: () => { then: (ok: () => void, fail?: (e: unknown) => void) => unknown };
        run: () => void;
        unload: () => void;
      };
      Orchestrator?: Record<string, unknown>;
      isDebug?: boolean;
    };
  }
}

/**
 * Re-runs Website Feedback whenever the route changes.
 * Call start() once, from the root component.
 *
 * Skip this if the project has "Re-evaluate intercept logic when the URL
 * changes" turned on. Qualtrics handles it then, and doing both means
 * everything fires twice.
 */
@Injectable({ providedIn: 'root' })
export class QsiRouteService {
  private router = inject(Router);

  /** Just for the counter in the footer, not part of the integration. */
  readonly runs = signal(0);

  private lastRun: string | null = null;
  private checkedSetting = false;
  private pending: string | null = null;

  start(): void {
    // Waits for qsi_js_loaded. Navigate while the deployment code is still
    // loading and it gets picked up after, instead of being dropped.
    window.addEventListener(
      'qsi_js_loaded',
      () => {
        const url = this.pending;
        this.pending = null;
        if (url) this.reRun(url);
      },
      { once: true },
    );

    // Routing is a stream here, not a value you watch, so filter for the one
    // that fires once the route has resolved.
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((event) => {
        // urlAfterRedirects, not url, or a redirect fires this twice. It has
        // the query string in it, so /products and /products?promo=x count as
        // different URLs.
        const url = event.urlAfterRedirects;

        this.warnIfProjectAlreadyHandlesThis();

        // Angular fires NavigationEnd for the first navigation too, which
        // index.html already handled.
        if (this.lastRun === null) {
          this.lastRun = url;
          return;
        }
        if (this.lastRun === url) return;

        this.reRun(url);
      });
  }

  private reRun(url: string): void {
    const api = window.QSI?.API;

    // Still loading. Remember where we are so the listener above picks it up.
    if (!api) {
      this.pending = url;
      return;
    }

    this.lastRun = url;

    // unload() first, or load() fails and run() never happens.
    api.unload();

    // .then(ok, fail), not .catch(). What load() returns has no .catch().
    api.load().then(
      () => api.run(),
      (err) => console.warn('[qsi] load failed', err),
    );

    console.log('[qsi] re-ran for', url);
    this.runs.update((n) => n + 1);
  }

  /**
   * Warns once if the project already re-evaluates on URL change, because then
   * this is doing the same work twice.
   */
  private warnIfProjectAlreadyHandlesThis(): void {
    if (this.checkedSetting) return;
    if (!window.QSI?.Orchestrator) return; // not loaded yet, look again next time
    this.checkedSetting = true;

    try {
      const orchestrator = window.QSI.Orchestrator as {
        csTargetingParams?: {
          targetingResponse?: { RequestData?: { reevaluateInterceptOnUrlChange?: boolean } };
        };
      };
      const auto =
        orchestrator.csTargetingParams?.targetingResponse?.RequestData
          ?.reevaluateInterceptOnUrlChange;

      if (auto) {
        console.warn(
          '[qsi] This project has "Re-evaluate intercept logic when the URL changes" turned on, ' +
            'so Qualtrics is already re-running on route changes. This service is doing it a ' +
            'second time. Turn off one or the other.',
        );
      }
    } catch {
      // ignore
    }
  }
}
