import { ModuleDescriptor } from '@/modules-arch/module-descriptor'
import { CreateSaleFormModule } from '@modules/create-sale-form/module'

export class CreateOpportunityModule extends ModuleDescriptor {
  constructor (opts = {}) {
    super({
      importComponentFn: _ => import('@/vue/modules/create-opportunity'),
      importStoreFn: async _ => {
        const { createAssetSaleModule } = await import(
          '@/vue/modules/create-opportunity/store'
        )
        return createAssetSaleModule
      },
      incompatibles: [
        CreateSaleFormModule,
      ],
      ...opts,
    })
  }
}
