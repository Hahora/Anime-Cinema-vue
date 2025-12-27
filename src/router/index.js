import { createRouter, createWebHistory } from 'vue-router'
import { animeApi } from '@/api/animeApi'

import UsersView from '@/views/UsersView.vue'
import NotFoundView from '@/views/NotFoundView.vue'
import ServiceUnavailableView from '@/views/ServiceUnavailableView.vue'
import RegisterView from '@/views/RegisterView.vue'

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginView.vue'),
    meta: { requiresGuest: true },
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterView,
  },
  {
    path: '/',
    name: 'home',
    component: () => import('../views/HomeView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/anime/:id',
    name: 'anime',
    component: () => import('../views/AnimeView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/genres',
    name: 'genres',
    component: () => import('../views/GenresView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/profile/:id?',
    name: 'profile',
    component: () => import('../views/ProfileView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/favorites',
    name: 'favorites',
    component: () => import('../views/FavoritesView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/history',
    name: 'history',
    component: () => import('../views/HistoryView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/users',
    name: 'Users',
    component: UsersView,
    meta: { requiresAuth: true },
  },
  {
    path: '/503',
    name: 'ServiceUnavailable',
    component: ServiceUnavailableView,
  },

  // 404 - должен быть последним
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFoundView,
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// Защита роутов
router.beforeEach((to, from, next) => {
  const isAuthenticated = animeApi.isAuthenticated()

  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'login' })
  } else if (to.meta.requiresGuest && isAuthenticated) {
    next({ name: 'home' })
  } else {
    next()
  }
})

export default router
