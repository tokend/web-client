import { ModuleDescriptor } from '@/modules-arch/module-descriptor'

export class SharesTopBarModule extends ModuleDescriptor {
  constructor (opts = {}) {
    super({
      importComponentFn: _ => import('@/vue/modules/shares-top-bar'),
      ...opts,
    })
  }
}
