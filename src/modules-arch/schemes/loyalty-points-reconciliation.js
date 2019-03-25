import { vueRoutes } from '@/vue-router/routes'

import { MovementsHistoryModule } from '@/vue/modules/movements-history/module'
import { MovementsHistoryPageModule } from '@/vue/pages/movements-page-module'
import { IssuancePageModule } from '@/vue/pages/issuance-page-module'
import { IssuanceExplorerModule } from '@/vue/modules/issuance-explorer/module'
import { LoyaltyPointsStatisticsModule } from '@/vue/modules/loyalty-points/loyalty-points-statistics/module'
import { StatisticsPageModule } from '@/vue/pages/statistics-page'
import { RequestsPageModule } from '@/vue/pages/requests-page-module'
import { IncomingWithdrawalRequestsPageModule } from '@/vue/pages/incoming-withdrawal-requests-page'
import { TransferDrawerPseudoModule } from '@/modules-arch/pseudo-modules/transfer-drawer-pseudo-module'
import { WithdrawalDrawerPseudoModule } from '@/modules-arch/pseudo-modules/withdrawal-drawer-pseudo-module'
import { DepositDrawerPseudoModule } from '@/modules-arch/pseudo-modules/deposit-drawer-pseudo-module'
import { IssuanceDrawerPseudoModule } from '@/modules-arch/pseudo-modules/issuance-drawer-pseudo-module'
import { PreIssuanceDrawerPseudoModule } from '@/modules-arch/pseudo-modules/pre-issuance-drawer-pseudo-module'

export default {
  importEnLocaleFile () {
    return import('@/modules-arch/schemes/loyalty-points-reconciliation.en.json')
  },
  pages: [
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
          new IssuanceDrawerPseudoModule({
            isCorporateOnly: true,
          }),
          new PreIssuanceDrawerPseudoModule({
            isCorporateOnly: true,
          }),
        ],
      },
    ),

    new StatisticsPageModule({
      routerEntry: {
        path: '/statistics',
        name: vueRoutes.loyaltyPointsStatistics.name,
        meta: { pageNameTranslationId: 'pages-names.statistics' },
      },
      isCorporateOnly: true,
      menuButtonTranslationId: 'pages-names.statistics',
      menuButtonMdiName: 'chart-bar',
      submodules: [
        new LoyaltyPointsStatisticsModule(),
      ],
    }),

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
          new IncomingWithdrawalRequestsPageModule({
            routerEntry: {
              path: '/requests/incoming-withdrawal',
              name: vueRoutes.incomingWithdrawalRequests.name,
            },
          }),
        ],
      },
    ),
  ],
}
