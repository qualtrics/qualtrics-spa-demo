<script setup>
import { ref } from "vue";

const done = ref(false);
</script>

<template>
  <template v-if="done">
    <h1>Done</h1>
    <p>Nothing was sent anywhere.</p>
  </template>

  <template v-else>
    <h1>Checkout</h1>
    <form @submit.prevent="done = true">
      <label>
        Email
        <input type="email" required autocomplete="off" />
      </label>
      <button type="submit">Place order</button>
    </form>
  </template>
</template>
