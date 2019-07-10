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
            path: '/recovery',
            name: vueRoutes.recovery.name,
            component: resolve => require(['@/vue/pages/Recovery'], resolve),
            beforeEnter: buildAuthPageGuard(store),
          },
          {
            path: '/kyc-recovery-init',
            name: vueRoutes.kycRecoveryInit.name,
            component: resolve => require(['@/vue/pages/KycRecovery'], resolve),
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
}

// doesn't allow to visit auth page if user is already logged in
// or kyc recovery is initialized
function buildAuthPageGuard (store) {
  return function authPageGuard (to, from, next) {
    const isLoggedIn = store.getters[vuexTypes.isLoggedIn]
    const isKycRecoveryInProgress = store
      .getters[vuexTypes.isKycRecoveryInProgress]
    if (isLoggedIn) {
      if (isKycRecoveryInProgress) {
        next({ name: vueRoutes.kycRecoveryManagement.name })
      } else {
        next(vueRoutes.app)
      }
    } else {
      next()
    }
  }
}

// doesn't allow to visit in-app page if user is not already logged in
// or kyc recovery is initialized
function buildInAppRouteGuard ({ store, scheme }) {
  return function inAppRouteGuard (to, from, next) {
    const isLoggedIn = store.getters[vuexTypes.isLoggedIn]
    const isKycRecoveryInProgress = store
      .getters[vuexTypes.isKycRecoveryInProgress]
    // TODO: remove when all components modulerized
    const isAccessible = scheme.findModuleByPath(to.path)
      ? scheme.findModuleByPath(to.path).isAccessible
      : true
    if (isLoggedIn && isAccessible) {
      if (isKycRecoveryInProgress) {
        next({ name: vueRoutes.kycRecoveryManagement.name })
      } else {
        next()
      }
    } else {
      next({
        name: vueRoutes.login.name,
        query: { redirectPath: to.fullPath },
      })
    }
  }
}

// doesn't allow to visit kyc recovery management page if user's kyc recovery
// is not initialized
function buildKycRecoveryPageGuard (store) {
  return function inAppRouteGuard (to, from, next) {
    const isLoggedIn = store.getters[vuexTypes.isLoggedIn]
    const isKycRecoveryInProgress = store
      .getters[vuexTypes.accountKycRecoveryStatus]

    isLoggedIn && isKycRecoveryInProgress
      ? next()
      : next(vueRoutes.app)
  }
}
