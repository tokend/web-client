import { PageModuleDescriptor } from '@/modules-arch/page-module-descriptor'
import { MovementsHistoryModule } from '@/vue/modules/movements-history/module'

export class MovementsHistoryPageModule extends PageModuleDescriptor {
  constructor (pageOpts = {}, moduleOpts = {}) {
    super(pageOpts, {
      ...moduleOpts,
      importComponent: _ => import('@/vue/pages/Movements'),
      allowedSubmodules: [
        MovementsHistoryModule,
      ],
    })
  }
}
