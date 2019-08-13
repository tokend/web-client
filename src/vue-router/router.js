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
  let userRoutes = SchemeRegistry.current.pages
    .map(page => page.routerEntry)

  const inAppRouteGuard = buildInAppRouteGuard({
    scheme: SchemeRegistry.current,
    store,
    userRoutes,
  })

  userRoutes = userRoutes.map(item => ({
    ...item,
    beforeEnter: inAppRouteGuard,
  }))

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
        path: '/kyc-recovery-management',
        name: vueRoutes.kycRecoveryManagement.name,
        component: resolve => require(['@/vue/pages/KycRecovery/KycRecoveryManagement'], resolve),
        beforeEnter: buildKycRecoveryPageGuard(store),
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
            path: '/kyc-recovery-init',
            name: vueRoutes.kycRecoveryInit.name,
            component: resolve => require(['@/vue/pages/KycRecovery'], resolve),
            beforeEnter: buildAuthPageGuard(store),
          },
          {
            path: '/sign-up-general-verification',
            name: vueRoutes.signupKyc.name,
            component: resolve => require(['@/vue/pages/SignupGeneralKyc'], resolve),
          },
        ],
      },
      {
        path: '/',
        name: 'app',
        meta: { isNavigationRendered: true },
        component: resolve => require(['@/vue/AppContent'], resolve),
        beforeEnter: inAppRouteGuard,
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
// or kyc recovery is initialized
function buildAuthPageGuard (store) {
  return function authPageGuard (to, from, next) {
    const isLoggedIn = store.getters[vuexTypes.isLoggedIn]
    const isKycRecoveryInProgress = store
      .getters[vuexTypes.isKycRecoveryInProgress]
    const isAccountUnverified = store.getters[vuexTypes.isAccountUnverified]

    if (isLoggedIn && isKycRecoveryInProgress) {
      next({ name: vueRoutes.kycRecoveryManagement.name })
      return
    }

    if (isLoggedIn && isAccountUnverified) {
      next()
      return
    }

    if (isLoggedIn) {
      next(vueRoutes.app)
      return
    }

    next()
  }
}

// doesn't allow to visit in-app page if user is not already logged inr
function buildInAppRouteGuard ({ store, scheme, userRoutes }) {
  return function inAppRouteGuard (to, from, next, ...args) {
    const isLoggedIn = store.getters[vuexTypes.isLoggedIn]
    const isKycRecoveryInProgress = store
      .getters[vuexTypes.isKycRecoveryInProgress]
    const isAccountUnverified = store.getters[vuexTypes.isAccountUnverified]
    // TODO: remove when all components modularized
    const isAccessible = checkPathAccessible(to.path, scheme)

    if (!isLoggedIn) {
      next({
        name: vueRoutes.login.name,
        query: { redirectPath: to.fullPath },
      })
      return
    }

    if (isAccountUnverified) {
      next({ name: vueRoutes.signupKyc.name })
      return
    }

    if (isKycRecoveryInProgress) {
      next({ name: vueRoutes.kycRecoveryManagement.name })
      return
    }

    if (!isAccessible) {
      const parent = to.matched[to.matched.length - 1].parent
      const isParentAccessible = parent && parent.path &&
        checkPathAccessible(parent.path, scheme)

      let accessibleRoute

      // if parent accessible try find other accessible sibling
      if (isParentAccessible) {
        const siblings = userRoutes.find(r => r.path === parent.path).children
        const otherAccessibleSibling = findAccessibleRoute(siblings, scheme)
        accessibleRoute = otherAccessibleSibling
      }

      // if parent unaccessible or no accessible sibling found - find first
      // accessible user route
      if (!accessibleRoute) {
        accessibleRoute = getFirstAccessibleUserRoute(userRoutes, scheme)
      }

      // if no accessible user route found - we are helpless - throw an error
      if (!accessibleRoute) {
        throw new Error('router: no accessible routes to redirect the user!')
      }

      next(accessibleRoute)
      return
    }

    next()
  }
}

// doesn't allow to visit kyc recovery management page if user's kyc recovery
// is not initialized
function buildKycRecoveryPageGuard (store) {
  return function kycRecoveryRouteGuard (to, from, next) {
    const isLoggedIn = store.getters[vuexTypes.isLoggedIn]
    const isKycRecoveryInProgress = store
      .getters[vuexTypes.accountKycRecoveryStatus]
    isLoggedIn && isKycRecoveryInProgress
      ? next()
      : next(vueRoutes.app)
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
