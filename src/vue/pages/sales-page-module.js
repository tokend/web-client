import { PageModuleDescriptor } from '@/modules-arch/page-module-descriptor'
import { CreateSaleFormModule } from '@modules/create-sale-form/module'
import { SalesListPageModule } from '@/vue/pages/sales/all-sales-page-module'
import { SalesListOwnedPageModule } from '@/vue/pages/sales/user-owned-sales-page-module'
import { CreateOpportunityModule } from '../modules/create-opportunity/module'

export class SalesPageModule extends PageModuleDescriptor {
  constructor (opts = {}) {
    super({
      ...opts,
      importComponentFn: _ => import('@/vue/pages/Sales'),
      allowedSubmodules: [
        CreateSaleFormModule,
        SalesListPageModule,
        SalesListOwnedPageModule,
        CreateOpportunityModule,
      ],
    })
  }
}
