<template>
  <div>
    <h1>Page not found</h1>
    <p>
      Sorry, the page you are looking for does not exist.
      <RouterLink to="/">Home page</RouterLink>
    </p>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>
