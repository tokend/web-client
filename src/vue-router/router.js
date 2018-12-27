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

export const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '*',
      redirect: vueRoutes.app
    },
    {
      path: '/r/*',
      name: 'horizon-redirect',
      beforeEnter: resolveRedirect
    },
    {
      path: '/auth',
      name: vueRoutes.auth.name,
      redirect: vueRoutes.login,
      component: resolve => require(['@/vue/pages/Auth'], resolve),
      children: [
        {
          path: '/log-in',
          name: vueRoutes.login.name,
          component: resolve => require(['@/vue/pages/Login'], resolve),
          beforeEnter: authPageGuard
        },
        {
          path: '/sign-up',
          name: vueRoutes.signup.name,
          component: resolve => require(['@/vue/pages/Signup'], resolve),
          beforeEnter: authPageGuard
        },
        {
          path: '/verify/:paramsBase64',
          name: vueRoutes.verify.name,
          component: resolve => require(['@/vue/pages/Verify'], resolve),
          beforeEnter: authPageGuard,
          props: true
        },
        {
          path: '/recovery',
          name: vueRoutes.recovery.name,
          component: resolve => require(['@/vue/pages/Recovery'], resolve),
          beforeEnter: authPageGuard
        }
      ]
    },
    {
      path: '/',
      name: 'app',
      component: resolve => require(['@/vue/AppContent'], resolve),
      beforeEnter: inAppRouteGuard,
      redirect: vueRoutes.fees,
      children: [
        {
          path: '/fees',
          name: vueRoutes.fees.name,
          featureFlag: config.FEATURE_FLAGS.fees,
          component: resolve => require(['@/vue/pages/Fees'], resolve)
        },
        {
          path: '/issuance',
          name: vueRoutes.issuance.name,
          featureFlag: config.FEATURE_FLAGS.issuance,
          component: resolve => require(['@/vue/pages/Issuance'], resolve)
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
    ? next(vueRoutes.app)
    : next()
}

// doesn't allow to visit in-app page if user is not already logged in
function inAppRouteGuard (to, from, next) {
  const isLoggedIn = store.getters[vuexTypes.isLoggedIn]

  isLoggedIn
    ? next()
    : next(vueRoutes.login)
}
