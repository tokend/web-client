import Vue from 'vue'
import Router from 'vue-router'

import {
  store,
  vuexTypes
} from '@/vuex'
import config from '@/config'

import { resolveRedirect } from './redirect'
import { vueRoutes } from './routes'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '*',
      redirect: { name: 'app' }
    },
    {
      path: '/r/*',
      name: 'horizon-redirect',
      beforeEnter: resolveRedirect
    },
    {
      path: '/auth',
      name: vueRoutes.auth.name,
      component: require('@/vue/pages/Auth'),
      meta: { routeWithAuth: true },
      redirect: vueRoutes.login,
      children: [
        {
          path: '/log-in',
          name: vueRoutes.login.name,
          component: require('@/vue/pages/Login'),
          beforeEnter: authPageGuard
        },
        {
          path: '/sign-up',
          name: vueRoutes.signup.name,
          component: require('@/vue/pages/Signup'),
          beforeEnter: authPageGuard
        },
        {
          path: '/verify/:paramsBase64',
          name: vueRoutes.verify.name,
          component: require('@/vue/pages/Verify'),
          beforeEnter: authPageGuard,
          props: true
        },
        {
          path: '/recovery',
          name: vueRoutes.recovery.name,
          component: require('@/vue/pages/Recovery'),
          beforeEnter: authPageGuard
        }
      ]
    },
    {
      path: '/',
      name: 'app',
      component: require('@/vue/AppContent'),
      featureFlag: config.FEATURE_FLAGS.fees,
      beforeEnter: inAppRouteGuard,
      redirect: vueRoutes.fees,
      children: [
        {
          path: '/fees',
          name: vueRoutes.fees.name,
          component: require('@/vue/pages/Fees')
        }
      ].filter(route => route.featureFlag !== false)
    }
  ],
  scrollBehavior: _ => ({ x: 0, y: 0 })
})

// doesn't allow to visit auth page if user is already logged in
function authPageGuard (to, from, next) {
  const isLoggedIn = store.getters[vuexTypes.isLoggedIn]

  isLoggedIn
    ? next({ name: 'app' })
    : next()
}

// doesn't allow to visit in-app page if user is not already logged in
function inAppRouteGuard (to, from, next) {
  const isLoggedIn = store.getters[vuexTypes.isLoggedIn]

  isLoggedIn
    ? next()
    : next({ name: 'login' })
}

export { router }
