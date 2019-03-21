import { PageModuleDescriptor } from '@/modules-arch/page-module-descriptor'

export class SalesListOwnedPageModule extends PageModuleDescriptor {
  constructor (opts = {}) {
    super({
      ...opts,
      importComponentFn: _ => import('@/vue/pages/sales/AllSales'),
    })
  }
}
