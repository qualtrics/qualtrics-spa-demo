# Angular

Angular 22, standalone components, generated with `ng new`.

```bash
npm install
npm run dev
```

Open http://localhost:4200.

Runs without any Qualtrics code. Paste your deployment code into
`src/index.html` and restart to see intercepts.

## Layout

```
src/index.html                     deployment code goes here
src/main.ts
src/app/
  app.ts                           layout, and the ngOnInit that starts it
  app.routes.ts
  qsi/qsi-route.service.ts         the integration
  pages/
```

Three routes, and `QsiRouteService.start()` called once from `app.ts`. That's
the whole integration.

The counter in the footer goes up each time the service re-runs Qualtrics, so
you can tell it's working. It sits at zero until there's deployment code to run.

## Notes

Angular hands you navigation as a stream instead of a value, so you subscribe to
`router.events` and filter for `NavigationEnd`. That's the one that fires once
the route has actually resolved.

It uses `urlAfterRedirects`, not `url`. If a guard or redirect sends someone
elsewhere, `url` is what they asked for and `urlAfterRedirects` is where they
landed, and keying on `url` can re-run twice for one navigation. It also has the
query string in it, so `/products` and `/products?promo=x` count separately, the
way an intercept sees them.

Angular emits `NavigationEnd` for the first navigation too, which the deployment
code already handled, so the service records that URL and returns. React needs
the same guard. Vue doesn't.

`NavigationEnd` can fire before the new component has rendered, but `run()` is
chained off `load()`, so the network round trip puts it after the render in
practice.

The rest, including why it's never `.catch()`, is in the
[root README](../../README.md).
