import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AnimeView from '../views/AnimeView.vue'

const routes = [
  { path: '/', component: HomeView },
  { path: '/anime/:id', component: AnimeView, props: true },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
