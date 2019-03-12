import { PageModuleDescriptor } from '@/modules-arch/page-module-descriptor'
import { MovementsHistoryModule } from '@/vue/modules/movements-history/module'

export class DashboardPageModule extends PageModuleDescriptor {
  constructor (opts = {}) {
    super({
      ...opts,
      importComponent: _ => import('@/vue/pages/Dashboard'),
      allowedSubmodules: [
        MovementsHistoryModule,
      ],
    })
  }
}
