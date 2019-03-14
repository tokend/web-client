import { ModuleScheme } from '@/modules-arch/module-scheme'
import { vueRoutes } from '@/vue-router/routes'

import { MovementsHistoryModule } from '@/vue/modules/movements-history/module'
import { MovementsHistoryPageModule } from '@/vue/pages/movements-page-module'
import { DashboardPageModule } from '@/vue/pages/dashboard-page-module'
import { FeesPageModule } from '@/vue/pages/fees-page-module'
import { FeesModule } from '@/vue/modules/fees/module'
import { IssuancePageModule } from '@/vue/pages/issuance-page-module'
import { IssuanceExplorerModule } from '@/vue/modules/issuance-explorer/module'
import { TradePageModule } from '@/vue/pages/trade-page-module'
import { LimitsPageModule } from '@/vue/pages/limits-page-module'
import { AssetsPageModule } from '@/vue/pages/assets-page-module'
import { SalesPageModule } from '@/vue/pages/sales-page-module'
import { SaleDetailsPageModule } from '@/vue/pages/sale-details-page-module'
import { RequestsPageModule } from '@/vue/pages/requests-page-module'
import { SettingsPageModule } from '@/vue/pages/settings-page-module'

export default new ModuleScheme({
  importStylesFn: _ => import('@/scss/app.scss'),
  importEnLocaleFile: _ => import('@/modules-arch/schemes/vanilla/en.json'),
  pages: [
    new DashboardPageModule(
      {
        routerEntry: {
          path: '/dashboard',
          name: vueRoutes.dashboard.name,
          meta: { pageNameTranslationId: 'pages-names.dashboard' },
        },
        menuButtonTranslationId: 'pages-names.dashboard',
        menuButtonMdiName: 'view-dashboard',
        submodules: [
          new MovementsHistoryModule(),
        ],
      },
    ),
    new MovementsHistoryPageModule(
      {
        routerEntry: {
          path: '/movements',
          name: vueRoutes.movements.name,
          meta: { pageNameTranslationId: 'pages-names.movements' },
        },
        menuButtonTranslationId: 'pages-names.movements',
        menuButtonMdiName: 'menu',
        submodules: [
          new MovementsHistoryModule(),
        ],
      },
    ),

    new TradePageModule(
      {
        routerEntry: {
          path: '/trade',
          name: vueRoutes.trade.name,
          meta: { pageNameTranslationId: 'pages-names.trade' },
          redirect: vueRoutes.tradeExchange,
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
        menuButtonTranslationId: 'pages-names.trade',
        menuButtonMdiName: 'finance',
      },
    ),

    new LimitsPageModule(
      {
        routerEntry: {
          path: '/limits',
          name: vueRoutes.limits.name,
          meta: { pageNameTranslationId: 'pages-names.limits' },
        },
        menuButtonTranslationId: 'pages-names.limits',
        menuButtonMdiName: 'poll-box',
      },
    ),

    new AssetsPageModule(
      {
        routerEntry: {
          path: '/tokens',
          name: vueRoutes.assets.name,
          redirect: vueRoutes.assetsExplore,
          children: [
            // These guys cannot be used as independent modules too
            {
              path: '/tokens/explore',
              name: vueRoutes.assetsExplore.name,
              meta: { pageNameTranslationId: 'pages-names.tokens' },
              component: _ => import('@/vue/pages/AssetsExplorer'),
            },
            {
              path: '/tokens/balances',
              name: vueRoutes.balances.name,
              meta: { pageNameTranslationId: 'pages-names.tokens' },
              component: _ => import('@/vue/pages/Balances'),
            },
          ],
        },
        menuButtonTranslationId: 'pages-names.tokens',
        menuButtonMdiName: 'coins',
      },
    ),

    new IssuancePageModule(
      {
        routerEntry: {
          path: '/issuance',
          name: vueRoutes.issuance.name,
          meta: { pageNameTranslationId: 'pages-names.issuance' },
        },
        menuButtonTranslationId: 'pages-names.issuance',
        menuButtonMdiName: 'poll',
        submodules: [
          new IssuanceExplorerModule(),
        ],
      },
    ),

    new SalesPageModule(
      {
        routerEntry: {
          path: '/funds',
          name: vueRoutes.sales.name,
          meta: { pageNameTranslationId: 'pages-names.funds' },
        },
        menuButtonTranslationId: 'pages-names.funds',
        menuButtonMdiName: 'trending-up',
      },
    ),

    new SaleDetailsPageModule(
      {
        routerEntry: {
          path: '/funds/:id',
          name: vueRoutes.saleDetails.name,
          meta: { pageNameTranslationId: 'pages-names.fund-details' },
          redirect: to => ({ ...vueRoutes.saleCampaign, params: to.params }),
          props: true,
          children: [
            {
              path: '/funds/:id/campaign',
              name: vueRoutes.saleCampaign.name,
              component: _ => import('@/vue/pages/sale-details/SaleCampaignViewer'),
              props: true,
            },
          ],
        },
      },
    ),

    new RequestsPageModule(
      {
        routerEntry: {
          path: '/requests',
          name: vueRoutes.requests.name,
          redirect: vueRoutes.assetCreationRequests,
          meta: { pageNameTranslationId: 'pages-names.requests' },
          children: [
            {
              path: '/requests/token-creation',
              name: vueRoutes.assetCreationRequests.name,
              component: _ => import('@/vue/pages/AssetCreationRequests'),
            },
            {
              path: '/requests/fund-creation',
              name: vueRoutes.saleCreationRequests.name,
              component: _ => import('@/vue/pages/SaleCreationRequests'),
            },
            {
              path: '/requests/pre-issuance-upload',
              name: vueRoutes.preIssuanceUploadRequests.name,
              component: _ => import('@/vue/pages/PreIssuanceRequests'),
            },
          ],
        },
        isCorporateOnly: true,
        menuButtonTranslationId: 'pages-names.requests',
        menuButtonMdiName: 'book-open-variant',
      },
    ),

    new SettingsPageModule(
      {
        routerEntry: {
          path: '/settings',
          name: vueRoutes.settings.name,
          meta: { pageNameTranslationId: 'pages-names.settings' },
          redirect: vueRoutes.verification,
          children: [
            {
              path: '/settings/verification',
              name: vueRoutes.verification.name,
              component: _ => import('@/vue/pages/Verification'),
              children: [
                {
                  path: '/settings/verification/general',
                  name: vueRoutes.verificationGeneral.name,
                  component: _ => import('@/vue/forms/VerificationGeneralForm'),
                },
                {
                  path: '/settings/verification/corporate',
                  name: vueRoutes.verificationCorporate.name,
                  component: _ => import('@/vue/forms/VerificationCorporateForm'),
                },
              ],
            },
            {
              path: '/settings/security',
              name: vueRoutes.security.name,
              component: _ => import('@/vue/pages/Security'),
            },
          ],
        },
        menuButtonTranslationId: 'pages-names.settings',
        menuButtonMdiName: 'account-settings',
        menuSectionTranslationId: 'sidebar.section-account',
      }
    ),

    new FeesPageModule(
      {
        routerEntry: {
          path: '/fees',
          name: vueRoutes.fees.name,
          meta: { pageNameTranslationId: 'pages-names.fees' },
        },
        menuButtonTranslationId: 'pages-names.fees',
        menuButtonMdiName: 'flash',
        submodules: [
          new FeesModule(),
        ],
      },
    ),
  ],
})
