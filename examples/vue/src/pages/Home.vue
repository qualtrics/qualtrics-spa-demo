<script setup>
import { RouterLink } from "vue-router";
</script>

<template>
  <h1>Home</h1>
  <p>Click around the nav. The URL changes, the page doesn't reload.</p>

  <p class="note">
    Paste your deployment code into <code>index.html</code> and restart the dev server. It's in the
    <a
      href="https://www.qualtrics.com/support/website-app-feedback/settings-tab/deployment-section/"
      target="_blank"
      rel="noreferrer"
      >Deployment Tab</a
    >
    of your project. The app runs without it, you just won't see any intercepts.
  </p>

  <h2>Why this needs code</h2>
  <ul>
    <li>Deployment code runs when a page loads</li>
    <li>An SPA only loads once</li>
    <li>So nothing gets evaluated again after this page</li>
    <li><code>src/qsi/useQsiRoute.js</code> re-runs it on every route change</li>
  </ul>

  <h2>Try both ways to Products</h2>
  <ul>
    <li><RouterLink to="/products">Route change</RouterLink> keeps the page, counter goes up</li>
    <li><a href="/products">Full page load</a> reloads the browser, counter starts over</li>
  </ul>
</template>
