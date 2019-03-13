import { PageModuleDescriptor } from '@/modules-arch/page-module-descriptor'

export class SecurityPageModule extends PageModuleDescriptor {
  constructor (opts = {}) {
    super({
      ...opts,
      importComponentFn: _ => import('@/vue/pages/Security'),
    })
  }
}
