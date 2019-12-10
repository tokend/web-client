import Vue from 'vue'
import Router from 'vue-router'
import _get from 'lodash/get'
import { store, vuexTypes } from '@/vuex'
import { vueRoutes } from '@/vue-router/routes'
import { resolveRedirect } from '@/vue-router/redirect'

import AppContent from '@/vue/AppContent'

import Movements from '@/vue/pages/Movements'
import Dashboard from '@/vue/pages/Dashboard'
import Shares from '@/vue/pages/Shares'
import Assets from '@/vue/pages/Assets'
import Sales from '@/vue/pages/Sales'
import SaleDetails from '@/vue/pages/SaleDetails'
import SaleCampaignViewer from '@/vue/pages/sale-details/SaleCampaignViewer'
import Polls from '@/vue/pages/Polls'
import PollsAll from '@/vue/pages/PollsAll'
import PollRequests from '@/vue/pages/polls/PollRequests'
import Trade from '@/vue/pages/Trade'
import AssetCreationRequests from '@/vue/pages/AssetCreationRequests'
import AssetUpdateRequests from '@/vue/pages/AssetUpdateRequests'
import SaleCreationRequests from '@/vue/pages/SaleCreationRequests'
import PreIssuanceRequests from '@/vue/pages/PreIssuanceRequests'
import IncomingWithdrawalRequests from '@/vue/pages/IncomingWithdrawalRequests'
import Issuance from '@/vue/pages/Issuance'
import Limits from '@/vue/pages/Limits'
import Fees from '@/vue/pages/Fees'
import AtomicSwaps from '@/vue/pages/AtomicSwaps'
import AtomicSwapsExplore from '@/vue/pages/atomic-swaps/AtomicSwapsExplore'
import Settings from '@/vue/pages/Settings'
import Verification from '@/vue/pages/Verification'
import VerificationGeneralAdvanced
  from '@/vue/pages/VerificationGeneralAdvanced'
import VerificationCorporate from '@/vue/pages/VerificationCorporate'
import Security from '@/vue/pages/Security'

Vue.use(Router)

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
      beforeEnter: kycRecoveryGuard,
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
          beforeEnter: authPageGuard,
        },
        {
          path: '/sign-up',
          name: vueRoutes.signup.name,
          component: resolve => require(['@/vue/pages/Signup'], resolve),
          beforeEnter: authPageGuard,
        },
        {
          path: '/verify/:paramsBase64',
          name: vueRoutes.verify.name,
          component: resolve => require(['@/vue/pages/Verify'], resolve),
          beforeEnter: authPageGuard,
          props: true,
        },
        {
          path: '/kyc-recovery-init',
          name: vueRoutes.kycRecoveryInit.name,
          component: resolve => require(['@/vue/pages/KycRecovery'], resolve),
          beforeEnter: authPageGuard,
        },
      ],
    },
    {
      path: '/',
      name: vueRoutes.app.name,
      meta: { isNavigationRendered: true },
      component: AppContent,
      beforeEnter: redirectRouteGuard,
      children: [
        {
          path: '/movements',
          name: vueRoutes.movements.name,
          meta: {
            pageNameTranslationId: 'pages-names.movements',
          },
          component: Movements,
          beforeEnter: inAppRouteGuard,
        },
        {
          path: '/dashboard',
          name: vueRoutes.dashboard.name,
          meta: { pageNameTranslationId: 'pages-names.dashboard' },
          component: Dashboard,
          beforeEnter: inAppRouteGuard,
        },
        {
          path: '/register-of-shares',
          name: vueRoutes.registerOfShares.name,
          meta: {
            pageNameTranslationId: 'pages-names.register-of-shares',
            isCorporateOnly: true,
          },
          component: Shares,
          beforeEnter: inAppRouteGuard,
        },
        {
          path: '/assets',
          name: vueRoutes.assets.name,
          meta: {
            pageNameTranslationId: 'pages-names.movements',
          },
          component: Assets,
          beforeEnter: inAppRouteGuard,
        },
        {
          path: '/sales',
          name: vueRoutes.sales.name,
          meta: { pageNameTranslationId: 'pages-names.sales' },
          component: Sales,
          beforeEnter: inAppRouteGuard,
          children: [
            {
              path: '/sales/:id',
              name: vueRoutes.saleDetails.name,
              meta: { pageNameTranslationId: 'pages-names.sale-details' },
              component: SaleDetails,
              props: true,
              beforeEnter: inAppRouteGuard,
            },
            {
              path: '/sales/:id/campaign',
              name: vueRoutes.saleCampaign.name,
              meta: { pageNameTranslationId: 'pages-names.sale-details' },
              component: SaleCampaignViewer,
              props: true,
              beforeEnter: inAppRouteGuard,
            },
          ],
        },
        {
          path: '/polls',
          name: vueRoutes.polls.name,
          meta: { pageNameTranslationId: 'pages-names.polls' },
          component: Polls,
          beforeEnter: inAppRouteGuard,
          children: [
            {
              path: '/polls/all',
              name: vueRoutes.allPolls.name,
              props: true,
              component: PollsAll,
              beforeEnter: inAppRouteGuard,
            },
            {
              path: '/polls/poll-requests',
              name: vueRoutes.pollRequests.name,
              props: true,
              component: PollRequests,
              meta: {
                isCorporateOnly: true,
              },
              beforeEnter: inAppRouteGuard,
            },
          ],
        },
        {
          path: '/trade',
          name: vueRoutes.trade.name,
          meta: { pageNameTranslationId: 'pages-names.trade' },
          redirect: vueRoutes.tradeExchange,
          beforeEnter: inAppRouteGuard,
          component: Trade,
          children: [
            // Carefully: have some issues because of is-loading prop provided
            // to children from parent component. Leave it lke that for now
            {
              path: '/trade/exchange',
              name: vueRoutes.tradeExchange.name,
              component: _ => import('@/vue/pages/TradeExchange'),
            },
            {
              path: '/trade/my-orders',
              name: vueRoutes.tradeUserOffers.name,
              component: _ => import('@/vue/pages/TradeUserOffers'),
            },
          ],
        },
        {
          path: '/requests',
          name: vueRoutes.requests.name,
          meta: {
            pageNameTranslationId: 'pages-names.requests',
            isCorporateOnly: true,
          },
          component: Movements,
          beforeEnter: inAppRouteGuard,
          children: [
            {
              path: '/requests/asset-creation',
              name: vueRoutes.assetCreationRequests.name,
              component: AssetCreationRequests,
              beforeEnter: inAppRouteGuard,
            },
            {
              path: '/requests/asset-update',
              name: vueRoutes.assetUpdateRequests.name,
              component: AssetUpdateRequests,
              beforeEnter: inAppRouteGuard,
            },
            {
              path: '/requests/sale-creation',
              name: vueRoutes.saleCreationRequests.name,
              component: SaleCreationRequests,
              beforeEnter: inAppRouteGuard,
            },
            {
              path: '/requests/pre-issuance-upload',
              name: vueRoutes.preIssuanceUploadRequests.name,
              component: PreIssuanceRequests,
              beforeEnter: inAppRouteGuard,
            },
            {
              path: '/requests/incoming-withdrawal',
              name: vueRoutes.incomingWithdrawalRequests.name,
              component: IncomingWithdrawalRequests,
              beforeEnter: inAppRouteGuard,
            },
          ],
        },
        {
          path: '/issuance',
          name: vueRoutes.issuance.name,
          meta: { pageNameTranslationId: 'pages-names.issuance' },
          component: Issuance,
          beforeEnter: inAppRouteGuard,
        },
        {
          path: '/limits',
          name: vueRoutes.limits.name,
          meta: { pageNameTranslationId: 'pages-names.limits' },
          component: Limits,
          beforeEnter: inAppRouteGuard,
        },
        {
          path: '/fees',
          name: vueRoutes.fees.name,
          meta: { pageNameTranslationId: 'pages-names.fees' },
          component: Fees,
          beforeEnter: inAppRouteGuard,
        },
        {
          path: '/atomic-swaps',
          name: vueRoutes.atomicSwaps.name,
          meta: { pageNameTranslationId: 'pages-names.atomic-swaps' },
          component: AtomicSwaps,
          beforeEnter: inAppRouteGuard,
          children: [
            {
              path: '/atomic-swaps/explore',
              name: vueRoutes.atomicSwapsExplore.name,
              props: true,
              component: AtomicSwapsExplore,
              beforeEnter: inAppRouteGuard,
            },
          ],
        },
        {
          path: '/settings',
          name: vueRoutes.settings.name,
          meta: { pageNameTranslationId: 'pages-names.settings' },
          component: Settings,
          beforeEnter: inAppRouteGuard,
          children: [
            {
              path: '/settings/verification',
              name: vueRoutes.verification.name,
              component: Verification,
              beforeEnter: inAppRouteGuard,
              children: [
                {
                  path: '/settings/verification/general',
                  name: vueRoutes.verificationGeneral.name,
                  component: VerificationGeneralAdvanced,
                  beforeEnter: inAppRouteGuard,
                },
                {
                  path: '/settings/verification/corporate',
                  name: vueRoutes.verificationCorporate.name,
                  component: VerificationCorporate,
                  beforeEnter: inAppRouteGuard,
                },
              ],
            },
            {
              path: '/settings/security',
              name: vueRoutes.security.name,
              component: Security,
              beforeEnter: inAppRouteGuard,
            },
          ],
        },
        {
          path: '/movements',
          name: vueRoutes.movements.name,
          meta: {
            pageNameTranslationId: 'pages-names.movements',
          },
          component: Movements,
          beforeEnter: inAppRouteGuard,
        },
      ],
    },
  ],
})

export default router

// doesn't allow to visit kyc recovery management page if user's kyc recovery
// is not initialized
function kycRecoveryGuard (to, from, next) {
  const isLoggedIn = store.getters[vuexTypes.isLoggedIn]
  const isKycRecoveryInProgress = store
    .getters[vuexTypes.accountKycRecoveryStatus]
  isLoggedIn && isKycRecoveryInProgress
    ? next()
    : next(vueRoutes.app)
}

function authPageGuard (to, from, next) {
  const isLoggedIn = store.getters[vuexTypes.isLoggedIn]
  isLoggedIn ? next(vueRoutes.app) : next()
}

function redirectRouteGuard (to, from, next) {
  const isLoggedIn = store.getters[vuexTypes.isLoggedIn]
  const isAccountUnverified = store.getters[vuexTypes.isAccountUnverified]

  if (isLoggedIn && !isAccountUnverified) {
    const isKycRecoveryInProgress = store
      .getters[vuexTypes.isKycRecoveryInProgress]

    if (isKycRecoveryInProgress) {
      next(vueRoutes.kycRecoveryManagement)
    } else if (to.name === vueRoutes.app.name) {
      const isAccountCorporate = store.getters[vuexTypes.isAccountCorporate]
      if (isAccountCorporate) {
        next(vueRoutes.customers)
      } else {
        next(vueRoutes.assetsExplore)
      }
    } else {
      next()
    }
  } else if (isLoggedIn && isAccountUnverified) {
    next(vueRoutes.signupKyc)
  } else {
    next(vueRoutes.login)
  }
}

function inAppRouteGuard (to, from, next) {
  const isAccountCorporate = store.getters[vuexTypes.isAccountCorporate]
  const isAccountGeneral = store.getters[vuexTypes.isAccountGeneral]
  const isCorporateRouter = _get(to, 'meta.isCorporateOnly')
  const isGeneralRouter = _get(to, 'meta.isGeneralOnly')
  if (isAccountCorporate && isCorporateRouter) {
    next()
  } else if (isAccountGeneral && isGeneralRouter) {
    next()
  } else if (!isCorporateRouter && !isGeneralRouter) {
    next()
  } else {
    next(vueRoutes.app)
  }
}
