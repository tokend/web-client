import { ModuleScheme } from '@/modules-arch/module-scheme'

import { MovementsHistoryModule } from '@/vue/modules/movements-history/module'
import { FeesModule } from '@/vue/modules/fees/module'

export default new ModuleScheme({
  modules: [
    {
      instance: new MovementsHistoryModule(),
      submodules: [
        {
          instance: new FeesModule(),
        },
      ],
    },
  ],
})
