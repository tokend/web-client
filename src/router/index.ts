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
    redirect: { name: ROUTE_NAMES.homePage },
  },
  {
    path: '/home-page',
    name: ROUTE_NAMES.homePage,
    component: () => import('@/pages/HomePage.vue'),
  },
  {
    path: '/buttons',
    name: ROUTE_NAMES.buttonsPage,
    component: () => import('@/pages/ButtonsPage.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior: () => ({ top: 0, left: 0 }),
})

export { router, useRouter, useRoute }
