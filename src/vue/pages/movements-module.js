import { PageModule } from '@/modules-arch/page-module'
import { MovementsHistoryModule } from '../modules/movements-history/module'

export class MovementsHistoryPageModule extends PageModule {
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
