import { PageModuleDescriptor } from '@/modules-arch/page-module-descriptor'

export class SalesListPageModule extends PageModuleDescriptor {
  constructor (opts = {}) {
    super({
      ...opts,
      importComponentFn: _ => import('@/vue/pages/sales/Sales'),
    })
  }
}
