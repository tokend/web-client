import Vue from 'vue'
import Router from 'vue-router'

import {
  store,
  vuexTypes
} from '@/vuex'
import config from '@/config'

import { resolveRedirect } from './redirect'

// route components:
import AppContent from '@/vue/AppContent'
import Auth from '@/vue/pages/Auth'
import Login from '@/vue/pages/Login'
import Signup from '@/vue/pages/Signup'
import Recovery from '@/vue/pages/Recovery'
import Verify from '@/vue/pages/Verify'
import Fees from '@/vue/pages/Fees'

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
      name: 'auth',
      component: Auth,
      meta: { routeWithAuth: true },
      redirect: { name: 'login' },
      children: [
        {
          path: '/log-in',
          name: 'login',
          component: Login,
          beforeEnter: authPageGuard
        },
        {
          path: '/sign-up',
          name: 'signup',
          component: Signup,
          beforeEnter: authPageGuard
        },
        {
          path: '/verify/:paramsBase64',
          name: 'verify',
          component: Verify,
          beforeEnter: authPageGuard,
          props: true
        },
        {
          path: '/recovery',
          name: 'recovery',
          component: Recovery,
          beforeEnter: authPageGuard
        }
      ]
    },
    {
      path: '/',
      name: 'app',
      component: AppContent,
      featureFlag: config.FEATURE_FLAGS.fees,
      beforeEnter: inAppRouteGuard,
      redirect: { name: 'app.fees' },
      children: [
        {
          path: '/fees',
          name: 'app.fees',
          component: Fees
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
