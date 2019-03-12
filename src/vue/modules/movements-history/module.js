import { ModuleDescriptor } from '@/modules-arch/module-descriptor'

export class MovementsHistoryModule extends ModuleDescriptor {
  constructor (opts = {}) {
    super({
      importComponent: _ => import('@/vue/modules/movements-history'),
      importStore: async _ => {
        const { movementsHistoryModule: res } =
          await import('@/vue/modules/movements-history/store')
        return res
      },
      ...opts,
    })
  }
}
