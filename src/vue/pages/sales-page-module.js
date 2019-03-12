import { PageModuleDescriptor } from '@/modules-arch/page-module-descriptor'

export class SalesPageModule extends PageModuleDescriptor {
  constructor (opts = {}) {
    super({
      ...opts,
      importComponent: _ => import('@/vue/pages/Sales'),
    })
  }
}
