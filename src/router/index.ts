import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/dictionary',
      name: 'dictionary',
      component: () => import('@/views/DictionaryPage.vue'),
    },
    {
      path: '/words-sets/:id',
      name: 'words-set',
      component: () => import('@/views/WordsSetPage.vue'),
    },
  ],
})

export default router
