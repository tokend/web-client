import { PageModuleDescriptor } from '@/modules-arch/page-module-descriptor'

export class BusinessesMyPageModule extends PageModuleDescriptor {
  constructor (opts = {}) {
    super({
      ...opts,
      importComponentFn: _ => import('@/vue/pages/BusinessesMy'),
    })
  }
}
