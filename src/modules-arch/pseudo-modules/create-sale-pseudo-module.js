import { ModuleDescriptor } from '@/modules-arch/module-descriptor'
import { CreateAssetSaleModule } from '@/vue/modules/create-asset-sale/module'

export class CreateSalePseudoModule extends ModuleDescriptor {
  constructor (opts = {}) {
    super({
      importComponentFn: _ => import('@/vue/forms/CreateSaleForm'),
      incompatibles: [
        CreateAssetSaleModule,
      ],
      ...opts,
    })
  }
}
