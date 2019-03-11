import { ModuleScheme } from '@/modules-arch/module-scheme'
import { vueRoutes } from '@/vue-router/routes'

import { MovementsHistoryModule } from '@/vue/modules/movements-history/module'
import { MovementsHistoryPageModule } from '@/vue/pages/movements-page-module'
import { DashboardPageModule } from '@/vue/pages/dashboard-page-module'

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
      }
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
      }
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
