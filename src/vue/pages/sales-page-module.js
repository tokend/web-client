import { PageModuleDescriptor } from '@/modules-arch/page-module-descriptor'
import { CreateSalePseudoModule } from '@/modules-arch/pseudo-modules/create-sale-pseudo-module'
import { SalesListPageModule } from '@/vue/pages/sales/all-sales-page-module'
import { SalesListOwnedPageModule } from '@/vue/pages/sales/user-owned-sales-page-module'
import { CreateOpportunityModule } from '../modules/create-opportunity/module'

export class SalesPageModule extends PageModuleDescriptor {
  constructor (opts = {}) {
    super({
      ...opts,
      importComponentFn: _ => import('@/vue/pages/Sales'),
      allowedSubmodules: [
        CreateSalePseudoModule,
        SalesListPageModule,
        SalesListOwnedPageModule,
        CreateOpportunityModule,
      ],
    })
  }
}
