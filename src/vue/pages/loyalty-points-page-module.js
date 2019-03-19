import { PageModuleDescriptor } from '@/modules-arch/page-module-descriptor'
import { LoyaltyPointsInvoicesPageModule } from './loyalty-points-invoices-page'
import { LoyaltyPointsStatisticsPageModule } from './loyalty-points-statistics-page'
import { CreateInvoiceFormModule } from '@modules/create-invoice-form/module'

export class LoyaltyPointsPageModule extends PageModuleDescriptor {
  constructor (opts = {}) {
    super({
      ...opts,
      importComponentFn: _ => import('@/vue/pages/LoyaltyPoints'),
      allowedSubmodules: [
        LoyaltyPointsInvoicesPageModule,
        LoyaltyPointsStatisticsPageModule,
        CreateInvoiceFormModule,
      ],
    })
  }
}
