import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AnimeView from '../views/AnimeView.vue'
import LoginView from '../views/LoginView.vue'

const routes = [
  { path: '/', component: HomeView },
  { path: '/anime/:id', component: AnimeView, props: true },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
