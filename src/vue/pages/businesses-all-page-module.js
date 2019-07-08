import { PageModuleDescriptor } from '@/modules-arch/page-module-descriptor'

export class BusinessesAllPageModule extends PageModuleDescriptor {
  constructor (opts = {}) {
    super({
      ...opts,
      importComponentFn: _ => import('@/vue/pages/BusinessesAll'),
    })
  }
}
