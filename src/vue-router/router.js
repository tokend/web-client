import Vue from 'vue'
import Router from 'vue-router'

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
        path: '/supported-browsers',
        name: vueRoutes.supportedBrowsers.name,
        component: resolve => require(['@/vue/pages/SupportedBrowsers'], resolve),
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
        path: '/pre-issuance-guide',
        name: vueRoutes.preIssuanceGuide.name,
        component: resolve => require(['@/vue/pages/PreIssuanceGuide'], resolve),
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
          userRoutes,
        }),
        redirect: _ => {
          return getFirstAccessibleUserRoute(userRoutes, SchemeRegistry.current)
        },
        // TODO: beforeEnter should be applied to every entry of userRoutes
        children: userRoutes,
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
function buildInAppRouteGuard ({ store, scheme, userRoutes }) {
  return function inAppRouteGuard (to, from, next, ...args) {
    const isLoggedIn = store.getters[vuexTypes.isLoggedIn]
    // TODO: remove when all components modularized
    const isAccessible = checkPathAccessible(to.path, scheme)

    if (!isLoggedIn) {
      next({
        name: vueRoutes.login.name,
        query: { redirectPath: to.fullPath },
      })
    } else if (!isAccessible) {
      const parent = to.matched[to.matched.length - 1].parent
      const isParentAccessible = parent && parent.path &&
        checkPathAccessible(parent.path, scheme)

      let accessibleRoute

      if (isParentAccessible) {
        const siblings = userRoutes.find(r => r.path === parent.path).children
        const otherAccessibleSibling = findAccessibleRoute(siblings, scheme)
        accessibleRoute = otherAccessibleSibling
      }

      if (!accessibleRoute) {
        accessibleRoute = getFirstAccessibleUserRoute(userRoutes, scheme)
      }

      if (!accessibleRoute) {
        throw new Error('router: no accessible routes to redirect the user!')
      }

      next(accessibleRoute)
    } else {
      next()
    }
  }
}

function getFirstAccessibleUserRoute (userRoutes, scheme) {
  return userRoutes.find(item => {
    const isAccessible = checkPathAccessible(item.path, scheme)
    const hasChildren = item.children && item.children.length

    if (isAccessible && hasChildren) {
      const isAnyChildAccessible = findAccessibleRouteDeep(item, scheme)
      return Boolean(isAnyChildAccessible)
    } else {
      return isAccessible
    }
  })
}

function checkPathAccessible (path, scheme) {
  const routeModule = scheme.findModuleByPath(path)

  return routeModule
    ? routeModule.isAccessible
    : true
}

function findAccessibleRoute (array = [], scheme) {
  return array.find(item => checkPathAccessible(item.path, scheme))
}

function findAccessibleRouteDeep (value, scheme) {
  if (!value) {
    return
  }

  let result
  if (Array.isArray(value)) {
    result = findAccessibleRoute(value, scheme)
  } else if (value.children) {
    result = findAccessibleRouteDeep(value.children, scheme)
  }
  return result
}
