import { vueRoutes } from '@/vue-router/routes'

import { MovementsHistoryModule } from '@/vue/modules/movements-history/module'
import { MovementsHistoryPageModule } from '@/vue/pages/movements-page-module'
import { LoyaltyPointsPageModule } from '@/vue/pages/loyalty-points-page-module'
import { LoyaltyPointsInvoicesPageModule } from '@/vue/pages/loyalty-points-invoices-page'
import { LoyaltyPointsStatisticsPageModule } from '@/vue/pages/loyalty-points-statistics-page'
import { DashboardPageModule } from '@/vue/pages/dashboard-page-module'
import { IssuancePageModule } from '@/vue/pages/issuance-page-module'
import { IssuanceExplorerModule } from '@/vue/modules/issuance-explorer/module'
import { AssetsPageModule } from '@/vue/pages/assets-page-module'
import { RequestsPageModule } from '@/vue/pages/requests-page-module'
import { SettingsPageModule } from '@/vue/pages/settings-page-module'
import { PreIssuanceRequestsPageModule } from '@/vue/pages/pre-issuance-requests-page'
import { VerificationPageModule } from '@/vue/pages/verification-page-module'
import { VerificationGeneralPageModule } from '@/vue/pages/verification-general-page-module'
import { VerificationCorporatePageModule } from '@/vue/pages/verification-corporate-page-module'
import { SecurityPageModule } from '@/vue/pages/security-page-module'
import { ShowAccountIdPseudoModule } from '@/modules-arch/pseudo-modules/show-account-id-pseudo-module'
import { ChangePasswordPseudoModule } from '@/modules-arch/pseudo-modules/change-password-pseudo-module'
import { ShowSeedPseudoModule } from '@/modules-arch/pseudo-modules/show-seed-pseudo-module'
import { IssuanceDrawerPseudoModule } from '@/modules-arch/pseudo-modules/issuance-drawer-pseudo-module'
import { TransferDrawerPseudoModule } from '@/modules-arch/pseudo-modules/transfer-drawer-pseudo-module'
import { WithdrawalDrawerPseudoModule } from '@/modules-arch/pseudo-modules/withdrawal-drawer-pseudo-module'
import { DepositDrawerPseudoModule } from '@/modules-arch/pseudo-modules/deposit-drawer-pseudo-module'
import { DashboardChartPseudoModule } from '@/modules-arch/pseudo-modules/dashboard-chart-pseudo-module'

export default {
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
          new IssuanceDrawerPseudoModule({
            isCorporateOnly: true,
          }),
          new TransferDrawerPseudoModule(),
          new DashboardChartPseudoModule(),
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
          new WithdrawalDrawerPseudoModule(),
          new DepositDrawerPseudoModule(),
          new TransferDrawerPseudoModule(),
        ],
      },
    ),

    new LoyaltyPointsPageModule(
      {
        routerEntry: {
          path: '/loyalty-points',
          name: vueRoutes.loyaltyPoints.name,
          meta: { pageNameTranslationId: 'pages-names.loyalty-points' },
        },
        menuButtonTranslationId: 'pages-names.loyalty-points',
        menuButtonMdiName: 'menu',
        isAutoRedirectToFirstChild: true,
        submodules: [
          new LoyaltyPointsInvoicesPageModule({
            routerEntry: {
              path: '/loyalty-points/invoices',
              name: vueRoutes.loyaltyPointsInvoices.name,
            },
          }),
          new LoyaltyPointsStatisticsPageModule({
            routerEntry: {
              path: '/loyalty-points/statistics',
              name: vueRoutes.loyaltyPointsStatistics.name,
            },
          }),
        ],
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

    new RequestsPageModule(
      {
        routerEntry: {
          path: '/requests',
          name: vueRoutes.requests.name,
          meta: { pageNameTranslationId: 'pages-names.requests' },
        },
        isCorporateOnly: true,
        menuButtonTranslationId: 'pages-names.requests',
        menuButtonMdiName: 'book-open-variant',
        isAutoRedirectToFirstChild: true,
        submodules: [
          new PreIssuanceRequestsPageModule({
            routerEntry: {
              path: '/requests/pre-issuance-upload',
              name: vueRoutes.preIssuanceUploadRequests.name,
            },
          }),
        ],
      },
    ),

    new SettingsPageModule(
      {
        routerEntry: {
          path: '/settings',
          name: vueRoutes.settings.name,
          meta: { pageNameTranslationId: 'pages-names.settings' },
        },
        menuButtonTranslationId: 'pages-names.settings',
        menuButtonMdiName: 'account-settings',
        menuSectionTranslationId: 'sidebar.section-account',
        isAutoRedirectToFirstChild: true,
        submodules: [
          new VerificationPageModule({
            routerEntry: {
              path: '/settings/verification',
              name: vueRoutes.verification.name,
            },
            submodules: [
              new VerificationGeneralPageModule({
                routerEntry: {
                  path: '/settings/verification/general',
                  name: vueRoutes.verificationGeneral.name,
                },
              }),
              new VerificationCorporatePageModule({
                routerEntry: {
                  path: '/settings/verification/corporate',
                  name: vueRoutes.verificationCorporate.name,
                },
              }),
            ],
          }),

          new SecurityPageModule({
            routerEntry: {
              path: '/settings/security',
              name: vueRoutes.security.name,
            },
            submodules: [
              new ChangePasswordPseudoModule(),
              new ShowAccountIdPseudoModule(),
              new ShowSeedPseudoModule(),
            ],
          }),
        ],
      }
    ),
  ],
}
