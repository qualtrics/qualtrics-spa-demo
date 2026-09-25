import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs/operators';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-products',
  imports: [RouterLink],
  template: `
    <h1>Products</h1>
    <ul class="plans">
      @for (item of items; track item) {
        <li>{{ item }}</li>
      }
    </ul>

    <p class="qtip">Point an intercept at this page with "URL contains /products".</p>

    <h2>Query strings count too</h2>
    @if (promo()) {
      <p>
        Promo <code>{{ promo() }}</code> is on. Same path as before, only the query string changed,
        and the counter still moved. <a routerLink="/products">Clear it</a>.
      </p>
    } @else {
      <p>
        <a routerLink="/products" [queryParams]="{ promo: 'spring' }">Add ?promo=spring</a>. Same
        path, different URL. The service watches the query string, so it re-runs.
      </p>
    }
  `,
})
export class Products {
  private route = inject(ActivatedRoute);

  protected items = ['Starter plan', 'Standard plan', 'Unlimited plan'];
  protected promo = toSignal(this.route.queryParamMap.pipe(map((p) => p.get('promo'))));
}
