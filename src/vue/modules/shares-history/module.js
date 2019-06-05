import { ModuleDescriptor } from '@/modules-arch/module-descriptor'

export class SharesHistoryModule extends ModuleDescriptor {
  constructor (opts = {}) {
    super({
      importComponentFn: _ => import('@/vue/modules/shares-history'),
      importStoreFn: async _ => {
        const { sharesHistoryModule: res } =
          await import('@/vue/modules/shares-history/store')
        return res
      },
      ...opts,
    })
  }
}
