import { PageModuleDescriptor } from '@/modules-arch/page-module-descriptor'
import { MovementsHistoryModule } from '@/vue/modules/movements-history/module'

export class DashboardPageModule extends PageModuleDescriptor {
  constructor (pageOpts = {}, moduleOpts = {}) {
    super(pageOpts, {
      ...moduleOpts,
      importComponent: _ => import('@/vue/pages/Dashboard'),
      allowedSubmodules: [
        MovementsHistoryModule,
      ],
    })
  }
}
