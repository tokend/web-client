import { ModuleDescriptor } from '@/modules-arch/module-descriptor'

export class SaleStateWidgetModule extends ModuleDescriptor {
  constructor (opts = {}) {
    super({
      importComponentFn: _ => import('@/vue/pages/sale-details/SaleStateWidget'),
      ...opts,
    })
  }
}
