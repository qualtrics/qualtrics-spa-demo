import { Routes } from '@angular/router';

import { Home } from './pages/home';
import { Products } from './pages/products';
import { Checkout } from './pages/checkout';

/**
 * The `title` on each route is Angular setting the tab title for you. React and
 * Vue have no equivalent, so they do it by hand.
 *
 * Same problem as the deployment code. An SPA never reloads, so the title stays
 * on whatever the first page said unless you set it.
 */
export const routes: Routes = [
  { path: '', component: Home, title: 'Home · Qualtrics SPA demo' },
  { path: 'products', component: Products, title: 'Products · Qualtrics SPA demo' },
  { path: 'checkout', component: Checkout, title: 'Checkout · Qualtrics SPA demo' },
];
