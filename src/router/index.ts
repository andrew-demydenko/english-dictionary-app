import {
  createRouter,
  createWebHistory,
  createWebHashHistory,
} from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import PageNotFound from '@/views/PageNotFound.vue'

const router = createRouter({
  history: import.meta.env.VITE_IS_ELECTRON
    ? createWebHashHistory()
    : createWebHistory(import.meta.env.BASE_URL),
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
    { path: '/:catchAll(.*)', name: 'not-found', component: PageNotFound },
  ],
})

export default router
