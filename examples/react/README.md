# React

Vite, React 18, React Router 6.

```bash
npm install
npm run dev
```

Open http://localhost:5173.

Runs without any Qualtrics code. Paste your deployment code into `index.html`
and restart to see intercepts.

## Layout

```
index.html              deployment code goes here
src/
  main.jsx
  App.jsx
  qsi/useQsiRoute.js    the integration
  pages/
```

Three routes, and `useQsiRoute()` called once in `App.jsx`. That's the whole
integration.

The counter in the footer goes up each time the hook re-runs Qualtrics, so you
can tell it's working. It sits at zero until there's deployment code to run.

## Notes

`useEffect` fires on mount too, and the deployment code already handled that
first URL, so `lastRun` starts there rather than null.

The guard is a ref, not state. StrictMode runs effects twice in dev on purpose,
to catch ones that aren't safe to repeat, and unloading and reloading intercepts
is exactly that. With state the update wouldn't have committed between the two
runs and both would get through.

It uses `pathname + search`. Going from `/products` to `/products?promo=x`
leaves the path alone but it's a different URL to an intercept. The Products
page has a link for this so you can watch the counter move.

`useEffect` runs after React updates the DOM, so the new view is already on the
page when the intercept gets evaluated.

Don't drop the dependency array. Without it the effect runs on every render
instead of every navigation.

The rest, including why it's never `.catch()`, is in the
[root README](../../README.md).
