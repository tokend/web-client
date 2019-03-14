import Vue from 'vue'
import Router from 'vue-router'

import { vuexTypes } from '@/vuex'

import { resolveRedirect } from '@/vue-router/redirect'
import { vueRoutes } from '@/vue-router/routes'
import { SchemeRegistry } from '@/modules-arch/scheme-registry'

Vue.use(Router)

export function buildRouter (store) {
  return new Router({
    mode: 'history',
    routes: [
      {
        path: '*',
        redirect: vueRoutes.app,
      },
      {
        path: '/r/*',
        name: 'horizon-redirect',
        beforeEnter: resolveRedirect,
      },
      {
        path: '/terms',
        name: vueRoutes.terms.name,
        component: resolve => require(['@/vue/pages/Terms'], resolve),
      },
      {
        path: '/downloads',
        name: vueRoutes.downloads.name,
        component: resolve => require(['@/vue/pages/Downloads'], resolve),
      },
      {
        path: '/ios-installation-guide',
        name: vueRoutes.iosInstallationGuide.name,
        component: resolve => require(['@/vue/pages/IosInstallationGuide'], resolve),
      },
      {
        path: '/auth',
        name: vueRoutes.auth.name,
        redirect: vueRoutes.login,
        component: resolve => require(['@/vue/pages/Auth'], resolve),
        children: [
          {
            path: '/sign-in',
            name: vueRoutes.login.name,
            component: resolve => require(['@/vue/pages/Login'], resolve),
            beforeEnter: buildAuthPageGuard(store),
          },
          {
            path: '/sign-up',
            name: vueRoutes.signup.name,
            component: resolve => require(['@/vue/pages/Signup'], resolve),
            beforeEnter: buildAuthPageGuard(store),
          },
          {
            path: '/verify/:paramsBase64',
            name: vueRoutes.verify.name,
            component: resolve => require(['@/vue/pages/Verify'], resolve),
            beforeEnter: buildAuthPageGuard(store),
            props: true,
          },
          {
            path: '/recovery',
            name: vueRoutes.recovery.name,
            component: resolve => require(['@/vue/pages/Recovery'], resolve),
            beforeEnter: buildAuthPageGuard(store),
          },
        ],
      },
      {
        path: '/',
        name: 'app',
        meta: { isNavigationRendered: true },
        component: resolve => require(['@/vue/AppContent'], resolve),
        beforeEnter: buildInAppRouteGuard(store),
        redirect: vueRoutes.dashboard,
        children: SchemeRegistry.current.pages.map(page => page.routerEntry),
        // {
        //   path: '/documents',
        //   name: vueRoutes.documents.name,
        //   featureFlag: config.featureFlags.documents,
        //   redirect: vueRoutes.documentExplorer,
        //   meta: {
        //     pageNameTranslationId: 'pages-names.documents',
        //   },
        //   component: resolve => require(['@/vue/pages/Documents'], resolve),
        //   children: [
        //     {
        //       path: '/documents/explore',
        //       name: vueRoutes.documentExplorer.name,
        //       component: resolve =>
        //         require(['@/vue/pages/DocumentExplorer'], resolve),
        //     },
        //     {
        //       path: '/documents/:id',
        //       name: vueRoutes.documentManager.name,
        //       component: resolve =>
        //         require(['@/vue/pages/DocumentManager'], resolve),
        //       props: true,
        //     },
        //   ].filter(route => route.featureFlag !== false),
        // },
      },
    ],
    scrollBehavior: _ => ({ x: 0, y: 0 }),
  })
}

// doesn't allow to visit auth page if user is already logged in
function buildAuthPageGuard (store) {
  return function authPageGuard (to, from, next) {
    const isLoggedIn = store.getters[vuexTypes.isLoggedIn]

    isLoggedIn
      ? next(vueRoutes.app)
      : next()
  }
}

// doesn't allow to visit in-app page if user is not already logged in
function buildInAppRouteGuard (store) {
  return function inAppRouteGuard (to, from, next) {
    const isLoggedIn = store.getters[vuexTypes.isLoggedIn]

    isLoggedIn
      ? next()
      : next({
        name: vueRoutes.login.name,
        query: { redirectPath: to.fullPath },
      })
  }
}
