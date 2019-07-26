import { ModuleDescriptor } from '@/modules-arch/module-descriptor'

export class UserMovementsHistoryModule extends ModuleDescriptor {
  constructor (opts = {}) {
    super({
      importComponentFn: _ => import('@/vue/modules/user-movements-history'),
      importStoreFn: async _ => {
        const { userMovementsHistoryModule: res } =
          await import('@/vue/modules/user-movements-history/store')
        return res
      },
      ...opts,
    })
  }
}
