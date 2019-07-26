import { PageModuleDescriptor } from '@/modules-arch/page-module-descriptor'
import { UserMovementsHistoryModule } from '@modules/user-movements-history/module'

export class CustomersListPageModule extends PageModuleDescriptor {
  constructor (opts = {}) {
    super({
      ...opts,
      importComponentFn: _ => import('@/vue/pages/CustomersList'),
      allowedSubmodules: [
        UserMovementsHistoryModule,
      ],
    })
  }
}
