import { vueRoutes } from '@/vue-router/routes'

import { MovementsHistoryModule } from '@/vue/modules/movements-history/module'
import { MovementsHistoryPageModule } from '@/vue/pages/movements-page-module'
import { TradePageModule } from '@/vue/pages/trade-page-module'
import { LoyaltyPointsStatisticsModule } from '@/vue/modules/loyalty-points/loyalty-points-statistics/module'
import { StatisticsPageModule } from '@/vue/pages/statistics-page'
import { RequestsPageModule } from '@/vue/pages/requests-page-module'
import { IncomingWithdrawalRequestsPageModule } from '@/vue/pages/incoming-withdrawal-requests-page'
import { TransferDrawerPseudoModule } from '@/modules-arch/pseudo-modules/transfer-drawer-pseudo-module'
import { WithdrawalDrawerPseudoModule } from '@/modules-arch/pseudo-modules/withdrawal-drawer-pseudo-module'
import { DepositDrawerPseudoModule } from '@/modules-arch/pseudo-modules/deposit-drawer-pseudo-module'

export default {
  importEnLocaleFile () {
    return import('@/modules-arch/schemes/loyalty-points-reconcillation.en.json')
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

    new TradePageModule(
      {
        routerEntry: {
          path: '/trade',
          name: vueRoutes.trade.name,
          meta: { pageNameTranslationId: 'pages-names.trade' },
          redirect: vueRoutes.tradeExchange,
          children: [
            // Carefully: have some issues because of is-loading prop provided
            // to children from parent component. Leave it like that for now
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
