import { PageModuleDescriptor } from '@/modules-arch/page-module-descriptor'
import { CreateSalePseudoModule } from '@/modules-arch/pseudo-modules/create-sale-pseudo-module'
import { CreateAssetSaleModule } from '../modules/create-opportunity/module'
import { SalesListPageModule } from '@/vue/pages/sales/sales-list-page-module'
import { SalesListOwnedPageModule } from '@/vue/pages/sales/sales-list-owned-module'

export class SalesPageModule extends PageModuleDescriptor {
  constructor (opts = {}) {
    super({
      ...opts,
      importComponentFn: _ => import('@/vue/pages/Sales'),
      allowedSubmodules: [
        CreateSalePseudoModule,
        CreateAssetSaleModule,
        SalesListPageModule,
        SalesListOwnedPageModule,
      ],
    })
  }
}
