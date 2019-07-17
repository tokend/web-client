import { ModuleDescriptor } from '@/modules-arch/module-descriptor'

export class SimplifySaleStateWidgetModule extends ModuleDescriptor {
  constructor (opts = {}) {
    super({
      importComponentFn: _ => import('@/vue/pages/sale-details-simplified/SaleStateWidget'),
      ...opts,
    })
  }
}
