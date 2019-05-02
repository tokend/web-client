import Vue from 'vue'
import Router from 'vue-router'

import config from '@/config'
import { vuexTypes } from '@/vuex'

import { resolveRedirect } from '@/vue-router/redirect'
import { vueRoutes } from '@/vue-router/routes'
import { SchemeRegistry } from '@/modules-arch/scheme-registry'

Vue.use(Router)

export function buildRouter (store) {
  // TODO: find a way to rebuild router’s routes.
  // Because would be nice if we do not even build routes that the logged in
  // user cannot access
  const userRoutes = SchemeRegistry.current.pages
    .map(page => page.routerEntry)

  const router = new Router({
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
        meta: {
          title: vueRoutes.terms.meta.title,
        },
        component: resolve => require(['@/vue/pages/Terms'], resolve),
      },
      {
        path: '/downloads',
        name: vueRoutes.downloads.name,
        meta: {
          title: vueRoutes.downloads.meta.title,
        },
        component: resolve => require(['@/vue/pages/Downloads'], resolve),
      },
      {
        path: '/ios-installation-guide',
        name: vueRoutes.iosInstallationGuide.name,
        meta: {
          title: vueRoutes.iosInstallationGuide.meta.title,
        },
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
        beforeEnter: buildInAppRouteGuard({
          scheme: SchemeRegistry.current,
          store,
        }),
        redirect: userRoutes[0],
        children: userRoutes,
      },
    ],
    scrollBehavior: _ => ({ x: 0, y: 0 }),
  })

  router.beforeEach((to, from, next) => {
    setDocumentTitle(to, from, next)
  })

  return router
}

// sets browser tab title for appropriate page depends on existed meta tag
// defined in "vueRoutes". If appropriate meta tag does not exist, title value
// takes from "DEFAULT_APPLICATION_TITLE" defined in the main config
function setDocumentTitle (to, from, next) {
  const defaultTitle = config.DEFAULT_APPLICATION_TITLE
  const nearestWithTitle = to.matched.slice().reverse()
    .find(r => r.meta && r.meta.title)

  if (nearestWithTitle) {
    document.title = `${defaultTitle} | ${nearestWithTitle.meta.title}`
  } else {
    document.title = defaultTitle
  }
  next()
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
function buildInAppRouteGuard ({ store, scheme }) {
  return function inAppRouteGuard (to, from, next) {
    const isLoggedIn = store.getters[vuexTypes.isLoggedIn]
    // TODO: remove when all components modulerized
    const isAccessible = scheme.findModuleByPath(to.path)
      ? scheme.findModuleByPath(to.path).isAccessible
      : true

    isLoggedIn && isAccessible
      ? next()
      : next({
        name: vueRoutes.login.name,
        query: { redirectPath: to.fullPath },
      })
  }
}
