import { ModuleDescriptor } from '@/modules-arch/module-descriptor'

export class FeesModule extends ModuleDescriptor {
  constructor (opts = {}) {
    super({
      importComponent: _ => import('@/vue/modules/fees/index.vue'),
      storePath: '@/vue/modules/fees/store/index.js',
      ...opts,
    })
  }
}
