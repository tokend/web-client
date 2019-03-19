import { PageModuleDescriptor } from '@/modules-arch/page-module-descriptor'
import { CreateSalePseudoModule } from '@/modules-arch/pseudo-modules/create-sale-pseudo-module'
import { CreateOpportunityModule } from '../modules/create-opportunity/module'

export class SalesPageModule extends PageModuleDescriptor {
  constructor (opts = {}) {
    super({
      ...opts,
      importComponentFn: _ => import('@/vue/pages/Sales'),
      allowedSubmodules: [
        CreateSalePseudoModule,
        CreateOpportunityModule,
      ],
    })
  }
}
