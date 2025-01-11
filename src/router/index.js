import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'shopping-list',
      component: () => import('../views/ShoppingView.vue'),
    }
  ],
})

export default router
