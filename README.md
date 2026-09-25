# Qualtrics SPA integration demo

How to keep Qualtrics Website Feedback working in a single page application, shown in
React, Angular and Vue. Each one is the same three-page site with the
integration in a single file, so you can see what changes between frameworks
and what doesn't.

An SPA loads one page up front and then swaps the content as you
move around. From the outside it behaves like any other site. Underneath,
nothing reloads.

Qualtrics deployment code runs on a page load. An SPA doesn't reload as you
move between pages, so it won't re-evaluate on its own. Hooking it up to your
router keeps intercepts working for the whole visit, which is what these
examples do.

## Running it

```
examples/react     npm install && npm run dev    localhost:5173
examples/vue       npm install && npm run dev    localhost:5174
examples/angular   npm install && npm run dev    localhost:4200
```

The apps run without any Qualtrics code. To see intercepts, paste your
deployment code into that example's `index.html` and restart.

Nothing is shared between the three. These are standalone examples.

## Two ways to set it up

If your app changes the URL as people navigate, turning on
["Re-evaluate intercept logic when the URL changes"](https://www.qualtrics.com/support/website-app-feedback/common-use-cases/single-page-application/#URLChange)
gets your intercepts evaluated on those later changes as well as on the first
page load. Qualtrics handles it from there and you write no code.

The other option is to call the API yourself on each route change, which is
what these examples do.

Either way the URL has to change. That's what routers use `history.pushState()`
for. If part of your app swaps content without changing the URL, neither option
catches it and you'll need to re-run it yourself from wherever that happens.

If an intercept is set to display with custom JavaScript instead of
automatically, the checkbox alone won't show it on each page. You still need to
call `run()` yourself after each navigation. The API approach already does
that on every route change, so it needs nothing extra. That display setting is
at the intercept level.

Docs:
[Single Page Application](https://www.qualtrics.com/support/website-app-feedback/common-use-cases/single-page-application/)
and [SPA usage](https://api.qualtrics.com/5d8692e227ff6-spa-usage).

## The integration

`unload()`, `load()`, `run()` on every route change. How you find out the route
changed is the only part that differs between frameworks.

### React

[`examples/react/src/qsi/useQsiRoute.js`](examples/react/src/qsi/useQsiRoute.js):

```js
const { pathname, search } = useLocation();
const url = pathname + search;
const loaded = useQsiLoaded();
const lastRun = useRef(url);

useEffect(() => {
  if (!loaded) return;
  if (lastRun.current === url) return;
  lastRun.current = url;

  window.QSI.API.unload();
  window.QSI.API.load().then(window.QSI.API.run, err => console.warn(err));
}, [url, loaded]);
```

`useEffect` also fires on mount, and the deployment code already handled that
first URL, so `lastRun` starts there instead of null. It's a ref because
StrictMode runs effects twice in dev and state wouldn't have committed between
the two.

`search` is in there because `/products` and `/products?promo=x` are two
different URLs as far as an intercept cares. `pathname` is the same for both, so
on its own it misses that one.

### Angular

[`examples/angular/src/app/qsi/qsi-route.service.ts`](examples/angular/src/app/qsi/qsi-route.service.ts):

```ts
this.router.events
  .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
  .subscribe((event) => {
    const url = event.urlAfterRedirects;
    if (this.lastRun === null) { this.lastRun = url; return; }
    if (this.lastRun === url) return;
    this.reRun(url);
  });
```

Angular gives you navigation as a stream instead of a value, so you filter for
`NavigationEnd`. It fires one for the first navigation as well, hence the first
guard. `urlAfterRedirects` has the query string in it already.

### Vue

[`examples/vue/src/qsi/useQsiRoute.js`](examples/vue/src/qsi/useQsiRoute.js):

```js
const route = useRoute();
const loaded = useQsiLoaded();
let lastRun = route.fullPath;

watch([() => route.fullPath, loaded], ([url, isLoaded]) => {
  if (!isLoaded) return;
  if (lastRun === url) return;
  lastRun = url;

  window.QSI.API.unload();
  window.QSI.API.load().then(window.QSI.API.run, err => console.warn(err));
}, { flush: "post" });
```

`watch` doesn't fire for the value it starts on, only for changes, so no
first-navigation guard needed here. `fullPath` covers the query string.

`flush: "post"` makes it run after Vue updates the DOM. Skip it and you're
looking at the page you just left.

## Best practices

The examples follow all four. There's a fifth about DXA Session Recording,
which this doesn't cover.

1. Keep the deployment code in `index.html`, not in a component. In a component
   it re-injects on every mount and you get duplicate requests and impressions.
2. Call `unload()` before `load()`, or you keep the creatives from the previous
   page. Skip it and `load()` rejects, `run()` never fires, and nothing shows up
   in the console.
3. Chain `run()` off `load()` so it doesn't fire mid-request. Calling the three
   in sequence usually works on a fast connection, which is how it passes local
   testing and then fails for real users. Use two arguments,
   `.then(done, fail)`. What `load()` returns is promise-like but has no
   `.catch()`, so calling one throws.
4. Wait for `qsi_js_loaded` before calling anything. Each example has a helper
   for it. Navigate while the code is still loading and it gets picked up once
   it's ready instead of being dropped.

## Gotchas

- Turn off "Re-evaluate intercept logic when the URL changes" first. Leave it on
  and Qualtrics re-runs by itself, so the demo looks fine whether or not the
  hook works. The hook warns in the console if it sees the setting on.

- Re-run after the new view renders, not during the route change. Too early and
  the intercept looks at the page you just left. You get intercepts on the wrong
  view, or targets that aren't there yet. Chaining `run()` off `load()` handles
  it, since `load()` has to hit the network first.

- Check your intercept logic doesn't rule out localhost. A condition with your
  production domain in it won't match, so target the path instead, like "URL
  contains /products".

- Leave Cookie Domain blank on the intercept. Fill it in and the browser drops
  the cookie on localhost, display history stops saving, and it looks like your
  display logic is broken.

- Make sure you allow `*.qualtrics.com` in your Content Security Policy
  (`connect-src`, `frame-src`, `script-src`), plus `img-src` for
  `siteintercept.qualtrics.com`. Won't come up on localhost, but a block on a
  real site shows up as a console error.

- Popunders don't work locally.

To see which conditions passed or failed, turn on debugging. There's a button in
the footer, or run this in the console on any site:

```js
QSI.API.unload();
QSI.isDebug = true;
QSI.API.load();
QSI.API.run();
```

## Links

- [Single Page Application](https://www.qualtrics.com/support/website-app-feedback/common-use-cases/single-page-application/)
- [SPA usage](https://api.qualtrics.com/5d8692e227ff6-spa-usage)
- [Website Feedback JavaScript API](https://api.qualtrics.com/7023b0cd7acdd-website-feedback-java-script-api)
- React: [useEffect](https://react.dev/reference/react/useEffect) and
  [StrictMode](https://react.dev/reference/react/StrictMode)
- Vue: [watch](https://vuejs.org/guide/essentials/watchers.html) and
  [Vue Router](https://router.vuejs.org/)
- Angular: [routing](https://angular.dev/guide/routing)
- [History.pushState()](https://developer.mozilla.org/en-US/docs/Web/API/History/pushState)
