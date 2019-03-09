import { ModuleScheme } from '@/modules-arch/module-scheme'
import { vueRoutes } from '@/vue-router/routes'

import { MovementsHistoryModule } from '@/vue/modules/movements-history/module'
import { MovementsHistoryPageModule } from '@/vue/pages/movements-module'

export default new ModuleScheme({
  pages: [
    new MovementsHistoryPageModule(
      {
        routerEntry: {
          path: '/movements',
          name: vueRoutes.movements.name,
          meta: { pageNameTranslationId: 'pages-names.movements' },
        },
        menuButtonTranslationId: 'page-names.movements',
      },
      {
        submodules: [
          new MovementsHistoryModule(),
        ],
      }
    ),
  ],
})
