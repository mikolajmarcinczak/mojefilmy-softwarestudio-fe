import { createRouter, createWebHistory } from 'vue-router'
import MoviesList from "@/components/MoviesList.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: MoviesList,
    },
  ],
})

export default router
