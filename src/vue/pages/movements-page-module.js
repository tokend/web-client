import { PageModuleDescriptor } from '@/modules-arch/page-module-descriptor'
import { MovementsHistoryModule } from '@/vue/modules/movements-history/module'

export class MovementsHistoryPageModule extends PageModuleDescriptor {
  constructor (opts = {}) {
    super({
      ...opts,
      importComponent: _ => import('@/vue/pages/Movements'),
      allowedSubmodules: [
        MovementsHistoryModule,
      ],
    })
  }
}
