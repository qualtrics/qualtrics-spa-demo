<script setup>
import { ref, watch } from "vue";
import { RouterLink, RouterView, useRoute } from "vue-router";

import { useQsiRoute } from "./qsi/useQsiRoute.js";
import { useQsiLoaded } from "./qsi/useQsiLoaded.js";
import { enableQsiDebug, disableQsiDebug } from "./qsi/enableQsiDebug.js";

const route = useRoute();

// The whole Qualtrics integration. The count is only for the footer.
const runs = useQsiRoute();

// For the demo, not the integration.
const loaded = useQsiLoaded();

const debug = ref(false);

// Turns debug off when you navigate, so the window doesn't reopen on every
// page. This watcher uses the default flush, so it runs before the
// integration's, which uses flush: "post".
watch(
  () => route.fullPath,
  () => {
    disableQsiDebug();
    debug.value = false;
  }
);
</script>

<template>
  <header>
    <span class="brand">
      <img src="/qualtrics-logo.svg" alt="Qualtrics" />
      <span>SPA demo · Vue</span>
    </span>
    <nav>
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/products">Products</RouterLink>
      <RouterLink to="/checkout">Checkout</RouterLink>
    </nav>
  </header>

  <main>
    <RouterView />
  </main>

  <footer>
    <code>{{ route.fullPath }}</code> · 0 page reloads · {{ runs }}
    re-{{ runs === 1 ? "run" : "runs" }} · deployment code
    <span :class="loaded ? 'ok' : 'missing'">{{ loaded ? "loaded" : "not detected" }}</span>
    <template v-if="loaded">
      ·
      <span v-if="debug" class="ok">debug on</span>
      <button v-else @click="debug = enableQsiDebug()">open debug window</button>
    </template>
  </footer>
</template>
