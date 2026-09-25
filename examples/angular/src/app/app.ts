import { Component, OnInit, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';

import { QsiRouteService } from './qsi/qsi-route.service';
import { QsiLoadedService } from './qsi/qsi-loaded.service';
import { disableQsiDebug, enableQsiDebug } from './qsi/enable-qsi-debug';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <header>
      <span class="brand">
        <img src="/qualtrics-logo.svg" alt="Qualtrics" />
        <span>SPA demo · Angular</span>
      </span>
      <nav>
        <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">
          Home
        </a>
        <a routerLink="/products" routerLinkActive="active">Products</a>
        <a routerLink="/checkout" routerLinkActive="active">Checkout</a>
      </nav>
    </header>

    <main>
      <router-outlet />
    </main>

    <footer>
      <code>{{ router.url }}</code> · 0 page reloads · {{ runs() }} re-{{
        runs() === 1 ? 'run' : 'runs'
      }}
      · deployment code
      <span [class]="loaded() ? 'ok' : 'missing'">{{
        loaded() ? 'loaded' : 'not detected'
      }}</span>
      @if (loaded()) {
        ·
        @if (debug()) {
          <span class="ok">debug on</span>
        } @else {
          <button (click)="turnOnDebug()">open debug window</button>
        }
      }
    </footer>
  `,
})
export class App implements OnInit {
  protected router = inject(Router);
  private qsi = inject(QsiRouteService);

  // The whole Qualtrics integration. The count is only for the footer.
  protected runs = this.qsi.runs;

  // Both of these are for the demo, not the integration.
  protected loaded = inject(QsiLoadedService).loaded;

  protected debug = signal(false);

  constructor() {
    // Turns debug off when you navigate, so the window doesn't reopen on every
    // page. Subscribed here rather than in ngOnInit so it lands before the
    // route service, which starts in ngOnInit and is what calls load().
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(() => {
        disableQsiDebug();
        this.debug.set(false);
      });
  }

  ngOnInit(): void {
    this.qsi.start();
  }

  protected turnOnDebug(): void {
    this.debug.set(enableQsiDebug());
  }
}
