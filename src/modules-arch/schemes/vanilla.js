import { ModuleScheme } from '@/modules-arch/module-scheme'
import { vueRoutes } from '@/vue-router/routes'

import { MovementsHistoryModule } from '@/vue/modules/movements-history/module'
import { MovementsHistoryPageModule } from '@/vue/pages/movements-page-module'
import { DashboardPageModule } from '@/vue/pages/dashboard-page-module'
import { FeesPageModule } from '@/vue/pages/fees-page-module'
import { FeesModule } from '@/vue/modules/fees/module'
import { IssuancePageModule } from '@/vue/pages/issuance-page-module'
import { IssuanceExplorerModule } from '@/vue/modules/issuance-explorer/module'

export default new ModuleScheme({
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
      },
      {
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
      },
      {
        submodules: [
          new MovementsHistoryModule(),
        ],
      },
    ),

    // trade
    // limits
    // tokens

    new IssuancePageModule(
      {
        routerEntry: {
          path: '/issuance',
          name: vueRoutes.issuance.name,
          meta: { pageNameTranslationId: 'pages-names.issuance' },
        },
        menuButtonTranslationId: 'pages-names.issuance',
        menuButtonMdiName: 'poll',
      },
      {
        submodules: [
          new IssuanceExplorerModule(),
        ],
      },
    ),

    // funds
    // requests

    // - my account
    // settings

    new FeesPageModule(
      {
        routerEntry: {
          path: '/fees',
          name: vueRoutes.fees.name,
          meta: { pageNameTranslationId: 'pages-names.fees' },
        },
        menuButtonTranslationId: 'pages-names.fees',
        menuButtonMdiName: 'flash',
      },
      {
        submodules: [
          new FeesModule(),
        ],
      },
    ),

    // new MovementsHistoryPageModule(
    //   {
    //     routerEntry: {
    //       path: '/requests1',
    //       name: vueRoutes.movements.name,
    //       meta: { pageNameTranslationId: 'pages-names.requests' },
    //     },
    //     menuButtonTranslationId: 'pages-names.requests',
    //     menuButtonMdiName: 'book-open-variant',
    //     menuSectionTranslationId: 'sidebar.section-corporate',
    //     isCorporateOnly: true,
    //   },
    // ),
    // new MovementsHistoryPageModule(
    //   {
    //     routerEntry: {
    //       path: '/settings1',
    //       name: vueRoutes.movements.name,
    //       meta: { pageNameTranslationId: 'pages-names.settings' },
    //     },
    //     menuButtonTranslationId: 'pages-names.settings',
    //     menuButtonMdiName: 'account-settings',
    //     menuSectionTranslationId: 'sidebar.section-account',
    //   },
    // ),
  ],
})
