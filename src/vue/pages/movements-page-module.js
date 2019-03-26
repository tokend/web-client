import { PageModuleDescriptor } from '@/modules-arch/page-module-descriptor'
import { MovementsHistoryModule } from '@/vue/modules/movements-history/module'
import { MovementsTopBarModule } from '@modules/movements-top-bar/module'
import { MovementsTopBarReitModule } from '@modules/movements-top-bar-reit/module'

export class MovementsHistoryPageModule extends PageModuleDescriptor {
  constructor (opts = {}) {
    super({
      ...opts,
      importComponentFn: _ => import('@/vue/pages/Movements'),
      allowedSubmodules: [
        MovementsHistoryModule,
        MovementsTopBarModule,
        MovementsTopBarReitModule,
      ],
    })
  }
}
