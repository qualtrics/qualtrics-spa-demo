# Vue

Vite, Vue 3, Vue Router 4.

```bash
npm install
npm run dev
```

Open http://localhost:5174.

Runs without any Qualtrics code. Paste your deployment code into `index.html`
and restart to see intercepts.

## Layout

```
index.html              deployment code goes here
src/
  main.js
  App.vue
  qsi/useQsiRoute.js    the integration
  router/index.js
  pages/
```

Three routes, and `useQsiRoute()` called once in `App.vue`. That's the whole
integration.

The counter in the footer goes up each time the composable re-runs Qualtrics, so
you can tell it's working. It sits at zero until there's deployment code to run.

## Notes

Shortest of the three. `watch` only fires when its source changes, not for the
value it starts on, and the value it starts on is the URL the deployment code
already handled. React and Angular both fire for that one and need a guard.

It watches `route.fullPath`, not `route.path`. Going from `/products` to
`/products?promo=x` leaves the path alone but it's a different URL to an
intercept. The Products page has a link for this so you can watch the counter
move.

It passes `flush: "post"`. A `watch` callback runs before Vue updates the DOM by
default, so without it the page is still showing the view you just left and an
intercept looking for something on the new one won't find it.

`loaded` sits in the watch source next to the URL, so this also runs when the
deployment code finishes loading. Otherwise navigating during those first few
hundred milliseconds gets missed. `lastRun` starts at the URL you arrived on so
that doesn't turn into a duplicate run when nobody has navigated yet.

The rest, including why it's never `.catch()`, is in the
[root README](../../README.md).
