import { createRouter, createWebHistory } from "vue-router";

import Home from "../pages/Home.vue";
import Products from "../pages/Products.vue";
import Checkout from "../pages/Checkout.vue";

export const router = createRouter({
  history: createWebHistory(),

  // Vue Router calls this router-link-exact-active. Renamed to match the
  // stylesheet, nothing to do with Qualtrics.
  linkExactActiveClass: "active",

  routes: [
    { path: "/", component: Home, meta: { title: "Home" } },
    { path: "/products", component: Products, meta: { title: "Products" } },
    { path: "/checkout", component: Checkout, meta: { title: "Checkout" } },
  ],
});

/**
 * Keeps the tab title in step with the route.
 *
 * Nothing to do with Qualtrics, but the same problem. An SPA never reloads, so
 * the title stays on whatever the first page said unless you set it. Angular
 * has a route property for this, Vue and React don't.
 */
router.afterEach(to => {
  document.title = `${to.meta.title ?? "Not found"} · Qualtrics SPA demo`;
});
