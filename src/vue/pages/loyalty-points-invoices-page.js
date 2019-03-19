import { PageModuleDescriptor } from '@/modules-arch/page-module-descriptor'
import { LoyaltyPointsInvoicesModule } from '@modules/loyalty-points/loyalty-points-invoices/module'

export class LoyaltyPointsInvoicesPageModule extends PageModuleDescriptor {
  constructor (opts = {}) {
    super({
      ...opts,
      importComponentFn: _ => import('@/vue/pages/LoyaltyPointsInvoices'),
      allowedSubmodules: [
        LoyaltyPointsInvoicesModule,
      ],
    })
  }
}
