<script setup>
import { computed } from "vue";
import { RouterLink, useRoute } from "vue-router";

const items = ["Starter plan", "Standard plan", "Unlimited plan"];

const route = useRoute();
const promo = computed(() => route.query.promo);
</script>

<template>
  <h1>Products</h1>
  <ul class="plans">
    <li v-for="item in items" :key="item">{{ item }}</li>
  </ul>

  <p class="qtip">Point an intercept at this page with "URL contains /products".</p>

  <h2>Query strings count too</h2>
  <p v-if="promo">
    Promo <code>{{ promo }}</code> is on. Same path as before, only the query string changed, and
    the counter still moved. <RouterLink to="/products">Clear it</RouterLink>.
  </p>
  <p v-else>
    <RouterLink to="/products?promo=spring">Add ?promo=spring</RouterLink>. Same path, different
    URL. The composable watches the query string, so it re-runs.
  </p>
</template>
