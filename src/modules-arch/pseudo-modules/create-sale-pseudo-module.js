import { ModuleDescriptor } from '@/modules-arch/module-descriptor'
import { CreateOpportunityModule } from '@/vue/modules/create-opportunity/module'

export class CreateSalePseudoModule extends ModuleDescriptor {
  constructor (opts = {}) {
    super({
      importComponentFn: _ => import('@/vue/forms/CreateSaleForm'),
      incompatibles: [
        CreateOpportunityModule,
      ],
      ...opts,
    })
  }
}
