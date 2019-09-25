import { PageModuleDescriptor } from '@/modules-arch/page-module-descriptor'
import { MovementsHistoryModule } from '@modules/movements-history/module'

export class CustomersListPageModule extends PageModuleDescriptor {
  constructor (opts = {}) {
    super({
      ...opts,
      importComponentFn: _ => import('@/vue/pages/CustomersList'),
      allowedSubmodules: [
        MovementsHistoryModule,
      ],
    })
  }
}
