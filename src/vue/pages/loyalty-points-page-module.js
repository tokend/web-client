import { PageModuleDescriptor } from '@/modules-arch/page-module-descriptor'
import { LoyaltyPointsInvoicesPageModule } from './loyalty-points-invoices-page'
import { CreateInvoiceFormModule } from '@modules/loyalty-points/create-invoice-form/module'
import { IssuanceFormModule } from '@/vue/modules/issuance-form/module'
import { MovementsHistoryModule } from '@/vue/modules/movements-history/module'

export class LoyaltyPointsPageModule extends PageModuleDescriptor {
  constructor (opts = {}) {
    super({
      ...opts,
      importComponentFn: _ => import('@/vue/pages/LoyaltyPoints'),
      allowedSubmodules: [
        LoyaltyPointsInvoicesPageModule,
        CreateInvoiceFormModule,
        IssuanceFormModule,
        MovementsHistoryModule,
      ],
    })
  }
}
