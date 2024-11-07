import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
// import PageNotFound from '@/views/PageNotFound.vue'

const router = createRouter({
  history: createWebHistory(),
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
    // { path: '/:catchAll(.*)', name: 'not-found', component: PageNotFound },
  ],
})

export default router
