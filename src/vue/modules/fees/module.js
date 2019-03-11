import { ModuleDescriptor } from '@/modules-arch/module-descriptor'

export class FeesModule extends ModuleDescriptor {
  constructor (opts = {}) {
    super({
      importComponent: _ => import('@/vue/modules/fees'),
      importStoreModule: _ => import('@/vue/modules/fees/store'),
      ...opts,
    })
  }
}
