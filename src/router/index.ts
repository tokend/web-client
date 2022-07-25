import {
  createRouter,
  createWebHistory,
  RouteRecordRaw,
  useRoute,
  useRouter,
} from 'vue-router'

import { ROUTE_NAMES } from '@/enums'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/:catchAll(.*)',
    redirect: { name: ROUTE_NAMES.dashboard },
  },
  {
    path: '/login',
    name: ROUTE_NAMES.login,
    component: () => import('@/pages/LoginPage.vue'),
  },
  {
    path: '/register',
    name: ROUTE_NAMES.register,
    component: () => import('@/pages/RegisterPage.vue'),
  },
  {
    path: '/',
    name: ROUTE_NAMES.app,
    component: () => import('@/layouts/AuthorizedLayout.vue'),
    redirect: ROUTE_NAMES.dashboard,
    children: [
      {
        path: '/dashboard',
        name: ROUTE_NAMES.dashboard,
        component: () => import('@/pages/DashboardPage.vue'),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior: () => ({ top: 0, left: 0 }),
})

export { router, useRouter, useRoute }
