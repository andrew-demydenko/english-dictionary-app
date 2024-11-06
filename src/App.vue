<template>
  <header>
    <img
      alt="Vue logo"
      class="logo"
      src="@/assets/dictionary.png"
      width="60"
      height="60"
    />

    <div class="wrapper">
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/dictionary">Dictionary</RouterLink>
      </nav>
      <ImportComponent />
    </div>
  </header>

  <RouterView />
  <GlobalSnackbar />
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import ImportComponent from '@/components/ImportComponent.vue'
import GlobalSnackbar from './components/GlobalSnackbar.vue'
import { useWordsStore } from '@/stores/store'
const { loadWordsSets, loadWords } = useWordsStore()

onMounted(() => {
  loadWordsSets()
  loadWords()
})
</script>

<style scoped>
.wrapper {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
header {
  display: flex;
  margin-bottom: 1rem;
}

.logo {
  margin-right: 1rem;
}

nav {
  width: 100%;
  display: flex;
  font-size: 1rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (max-width: 576px) {
  header {
    margin-bottom: 1rem;
  }
  .logo {
    width: 48px;
    height: 48px;
    margin: 0 1rem 0 0;
  }

  nav {
    font-size: 0.9rem;
    padding: 0.8rem 0;
    margin-top: 0;
  }
}
</style>
