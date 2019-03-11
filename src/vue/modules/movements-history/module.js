import { ModuleDescriptor } from '@/modules-arch/module-descriptor'

export class MovementsHistoryModule extends ModuleDescriptor {
  constructor (opts = {}) {
    super({
      importComponent: _ => import('@/vue/modules/movements-history/index.vue'),
      storePath: '@/vue/modules/movements-history/store/index.js',
      ...opts,
    })
  }
}
